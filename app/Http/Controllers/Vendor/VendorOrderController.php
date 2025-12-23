<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class VendorOrderController extends Controller
{
    /**
     * Menampilkan pesanan berdasarkan status tertentu.
     */
    public function index(Request $request)
    {
        $vendor = Auth::user()->vendor;

        if (!$vendor) {
            return redirect()->route('dashboard')->with('error', 'Akses ditolak.');
        }

        // Ambil status dari query string atau default 'PENDING'
        $status = $request->query('status', 'PENDING'); // Default status adalah 'PENDING'

        // Ambil pesanan berdasarkan vendor yang sedang login dan filter berdasarkan status jika ada
        $orders = Order::whereHas('package', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id); // Filter berdasarkan vendor yang login
        })
        ->where('status', strtoupper($status))  // Filter berdasarkan status pesanan
        ->with([
            'customer:id,name,email',
            'package:id,name,price,vendor_id',
            'orderPayment:id,order_id,account_name,bank_source,proof_file,status,amount'
        ])
        ->latest()
        ->paginate(10);

        return Inertia::render('Vendor/pages/OrderManagementPage', [
            'orders' => $orders,
        ]);
    }

    /**
     * Menampilkan pesanan yang sedang diproses.
     */
    public function processedOrders()
    {
        return $this->getOrdersByStatus('PROCESSING');
    }

    /**
     * Menampilkan pesanan yang sudah selesai.
     */
    public function completedOrders()
    {
        return $this->getOrdersByStatus('COMPLETED');
    }

    /**
     * Mendapatkan pesanan berdasarkan status.
     */
    private function getOrdersByStatus($status)
    {
        $vendor = Auth::user()->vendor;

        if (!$vendor) {
            return redirect()->route('dashboard')->with('error', 'Akses ditolak.');
        }

        // Filter pesanan berdasarkan status yang diberikan
        $orders = Order::whereHas('package', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id);
        })
        ->where('status', $status)  // Filter berdasarkan status pesanan
        ->with([
            'customer:id,name,email',
            'package:id,name,price,vendor_id',
            'orderPayment:id,order_id,account_name,bank_source,proof_file,status,amount'
        ])
        ->latest()
        ->paginate(10);

        return Inertia::render('Vendor/pages/OrderManagementPage', [
            'orders' => $orders,
        ]);
    }

    /**
     * Verifikasi pembayaran oleh vendor.
     */
    public function verifyPayment(Request $request, $orderId)
    {
        // Validasi aksi (approve atau reject)
        $request->validate([
            'action' => 'required|in:approve,reject',
        ]);

        // Cari pesanan berdasarkan ID
        $order = Order::findOrFail($orderId);

        // Pastikan pesanan milik vendor yang sedang login
        if ($order->package->vendor_id !== Auth::user()->vendor->id) {
            abort(403, 'Akses ditolak.');
        }

        // Proses approve pembayaran
        if ($request->action === 'approve') {
            $order->payment_status = 'PAID';
            $order->status = 'PROCESSING';  // Status pesanan diproses
            $order->save();
            $order->orderPayment()->update(['status' => 'VERIFIED']);
            $message = 'Pembayaran diterima. Pesanan diproses.';
        } else {
            // Proses reject pembayaran
            $order->payment_status = 'REJECTED';
            $order->status = 'CANCELLED';  // Status pesanan dibatalkan
            $order->save();
            $order->orderPayment()->update(['status' => 'REJECTED']);
            $message = 'Pembayaran ditolak. Pesanan dibatalkan.';
        }

        // Redirect ke halaman pesanan yang sedang diproses setelah verifikasi
        return redirect()->route('vendor.orders.processed')->with('success', $message);
    }

    /**
     * Menandai pesanan sebagai selesai.
     */
    public function completeOrder($orderId)
    {
        // Cari pesanan berdasarkan ID
        $order = Order::findOrFail($orderId);

        // Pastikan pesanan milik vendor yang sedang login
        if ($order->package->vendor_id !== Auth::user()->vendor->id) {
            abort(403, 'Akses ditolak.');
        }

        // Ubah status pesanan menjadi selesai
        $order->status = 'COMPLETED';
        $order->save();

        // Update status pembayaran jika diperlukan
        $order->orderPayment()->update(['status' => 'COMPLETED']);

        // Redirect kembali ke halaman pesanan selesai setelah berhasil
        return redirect()->route('vendor.orders.completed')->with('success', 'Pesanan telah selesai.');
    }
}

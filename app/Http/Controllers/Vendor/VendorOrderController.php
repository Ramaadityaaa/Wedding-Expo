<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Order;
use App\Models\OrderPayment;
use Inertia\Inertia;

class VendorOrderController extends Controller
{
    /**
     * Menampilkan daftar pesanan masuk untuk Vendor yang login.
     */
    public function index()
    {
        $vendor = Auth::user()->vendor;

        // Ambil Order yang package-nya milik vendor ini
        // Eager load: user (customer), package, dan orderPayment (bukti bayar)
        $orders = Order::whereHas('package', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id);
        })
            ->with(['user', 'package', 'orderPayment']) // Pastikan relasi ini ada di Model Order
            ->latest()
            ->get();

        return Inertia::render('Vendor/pages/OrderManagementPage', [
            'orders' => $orders
        ]);
    }

    /**
     * Verifikasi Pembayaran (Terima / Tolak)
     */
    public function verifyPayment(Request $request, $orderId)
    {
        $request->validate([
            'action' => 'required|in:approve,reject',
        ]);

        $order = Order::findOrFail($orderId);

        // Pastikan order ini milik vendor yang login (Security Check)
        if ($order->package->vendor_id !== Auth::user()->vendor->id) {
            abort(403, 'Anda tidak memiliki akses ke pesanan ini.');
        }

        if ($request->action === 'approve') {
            // 1. Update Status Order
            $order->payment_status = 'PAID';
            $order->status = 'CONFIRMED'; // Atau status lain sesuai alur bisnis
            $order->save();

            // 2. Update Status di Tabel OrderPayment (jika ada)
            // Menggunakan update() pada relasi atau cari manual
            OrderPayment::where('order_id', $order->id)
                ->where('status', 'PENDING')
                ->update(['status' => 'PAID']);

            $message = 'Pembayaran berhasil dikonfirmasi. Pesanan diterima.';
        } else {
            // REJECT
            $order->payment_status = 'REJECTED';
            $order->status = 'CANCELLED';
            $order->save();

            OrderPayment::where('order_id', $order->id)
                ->where('status', 'PENDING')
                ->update(['status' => 'REJECTED']);

            $message = 'Pembayaran ditolak. Pesanan dibatalkan.';
        }

        return back()->with('success', $message);
    }
}

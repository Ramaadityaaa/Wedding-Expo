<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Order;
use App\Models\OrderPayment;
use Inertia\Inertia;
use Inertia\Response; // Perlu untuk tipe return eksplisit
use Illuminate\Http\RedirectResponse; // Perlu untuk redirect

class VendorOrderController extends Controller
{
    /**
     * Menampilkan daftar pesanan masuk untuk Vendor yang login (dengan paginasi).
     */
    public function index(): Response|RedirectResponse
    {
        $vendor = Auth::user()->vendor;

        // =======================================================
        // 🎯 PERBAIKAN 1: Error Handling Jika Vendor Belum Terdaftar
        // =======================================================
        if (!$vendor) {
            return redirect()->route('dashboard')->with('error', 'Akses ditolak: Akun Anda tidak terdaftar sebagai vendor.');
        }

        // =======================================================
        // 🎯 PERBAIKAN 2: Gunakan ->paginate(10) bukan ->get()
        // =======================================================
        $orders = Order::whereHas('package', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id);
        })
            ->with([
                // Optimasi Eager Loading (hanya ambil kolom yang perlu)
                'user:id,name,email', 
                'package:id,name,price,vendor_id', 
                'orderPayment:id,order_id,account_name,bank_source,proof_file'
            ]) 
            ->latest()
            ->paginate(10); // Mengembalikan objek Paginator yang dibutuhkan Inertia

        return Inertia::render('Vendor/pages/OrderManagementPage', [
            'orders' => $orders,
            // Anda dapat menambahkan status default di sini jika diperlukan
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
            $order->status = 'PROCESSED'; // Status yang lebih umum setelah pembayaran
            $order->save();

            // 2. Update Status di Tabel OrderPayment 
            $order->orderPayment()->update(['status' => 'VERIFIED']);

            $message = 'Pembayaran berhasil dikonfirmasi. Pesanan diproses.';
        } else {
            // REJECT
            $order->payment_status = 'REJECTED';
            $order->status = 'CANCELLED';
            $order->save();

            $order->orderPayment()->update(['status' => 'REJECTED']);

            $message = 'Pembayaran ditolak. Pesanan dibatalkan.';
        }

        return back()->with('success', $message);
    }
}
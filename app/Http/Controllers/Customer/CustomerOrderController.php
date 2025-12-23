<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;  // Pastikan Order model di-import
use Inertia\Inertia;

class CustomerOrderController extends Controller
{
    // Menampilkan daftar pesanan
    public function index()
    {
        // Cek apakah pengguna sudah login
        if (!auth()->check()) {
            return redirect()->route('login'); // Redirect jika pengguna belum login
        }

        // Ambil semua pesanan yang dimiliki oleh customer yang sedang login
        $orders = Order::where('customer_id', auth()->id())->with('package', 'vendor')->get();

        // Mengirim data pesanan ke halaman "Pesanan Saya"
        return Inertia::render('Customer/Orders/Index', [
            'orders' => $orders
        ]);
    }

    // Menampilkan detail pesanan
    public function show($orderId)
    {
        // Ambil pesanan beserta detail yang diperlukan
        $order = Order::with('package', 'vendor')->findOrFail($orderId);

        // Mengirim data pesanan ke halaman detail
        return Inertia::render('Customer/Orders/Show', [
            'order' => $order
        ]);
    }
}

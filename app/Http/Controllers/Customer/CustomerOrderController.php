<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;  // Pastikan Order model di-import
use Inertia\Inertia;

class CustomerOrderController extends Controller
{
    public function index()
    {
        // Cek apakah pengguna sudah login
        if (!auth()->check()) {
            return redirect()->route('login'); // Redirect jika pengguna belum login
        }

        // Ambil semua pesanan yang dimiliki oleh customer yang sedang login
        // Pastikan kolom yang benar digunakan ('customer_id' atau 'user_id')
        $orders = Order::where('customer_id', auth()->id())->get();

        // Mengirim data pesanan ke halaman "Pesanan Saya"
        return Inertia::render('Customer/Orders', [
            'orders' => $orders
        ]);
    }
}

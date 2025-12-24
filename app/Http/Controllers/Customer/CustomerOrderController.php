<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;  // Pastikan Order model di-import
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerOrderController extends Controller
{
    public function index(Request $request)
    {
        // Cek apakah pengguna sudah login
        if (!auth()->check()) {
            return redirect()->route('login'); // Redirect jika pengguna belum login
        }

        // Ambil Parameter "status" dari Tab (default: processed)
        $tabStatus = $request->query('status', 'processed');

        // Query Dasar: semua order milik customer
        $baseQuery = Order::where('customer_id', auth()->id())
            ->with('package', 'vendor'); // Memastikan kita mendapatkan relasi yang dibutuhkan

        // Filter Data Utama Berdasarkan Tab
        $ordersQuery = clone $baseQuery;

        switch ($tabStatus) {
            case 'completed':
                // Riwayat Selesai: status COMPLETED
                $ordersQuery->where('status', 'COMPLETED');
                break;

            case 'processed':
            default:
                // Diproses: semua yang bukan COMPLETED
                $ordersQuery->where(function ($q) {
                    $q->whereNull('status')
                      ->orWhere('status', '!=', 'COMPLETED');
                });
                break;
        }

        // Ambil data order (urut terbaru)
        $orders = $ordersQuery->latest()->get();

        // Summary count untuk tab
        $summaryData = [
            'processed' => (clone $baseQuery)->where(function ($q) {
                $q->whereNull('status')
                  ->orWhere('status', '!=', 'COMPLETED');
            })->count(),
            'completed' => (clone $baseQuery)->where('status', 'COMPLETED')->count(),
        ];

        // Mengirim data pesanan ke halaman "Pesanan Saya"
        return Inertia::render('Customer/Orders/Index', [
            'orders' => $orders,
            'currentStatus' => $tabStatus,
            'summaryData' => $summaryData,
        ]);
    }

    public function show($orderId)
    {
        // Ambil pesanan beserta detail yang diperlukan
        $order = Order::where('customer_id', auth()->id())
            ->with('package', 'vendor')
            ->findOrFail($orderId);

        // Mengirim data pesanan ke halaman detail
        return Inertia::render('Customer/Orders/Show', [
            'order' => $order
        ]);
    }
}

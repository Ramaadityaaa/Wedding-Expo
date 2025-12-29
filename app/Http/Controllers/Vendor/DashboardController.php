<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use App\Models\Order;
use App\Models\Review;
use Illuminate\Support\Str;

class DashboardController extends Controller
{
    public function verificationStatus(): Response|RedirectResponse
    {
        $user = Auth::user();
        $vendor = $user->weddingOrganizer;

        if (!$vendor) {
            return Inertia::render('Vendor/Payment/LoadingPage', [
                'status' => 'error',
                'message' => 'Profil Vendor Anda tidak ditemukan. Silakan hubungi admin.'
            ]);
        }

        if ($vendor->isApproved === 'APPROVED') {
            return redirect()->route('vendor.dashboard');
        }

        $status = strtolower($vendor->isApproved);
        $message = $status === 'pending'
            ? 'Akun Anda sedang dalam proses verifikasi oleh Administrator. Mohon tunggu.'
            : 'Pendaftaran Anda ditolak. Silakan hubungi admin untuk detail lebih lanjut.';

        return Inertia::render('Vendor/Payment/LoadingPage', [
            'status' => $status,
            'message' => $message
        ]);
    }

    public function index(): Response
    {
        $user = Auth::user();
        $vendor = $user->weddingOrganizer;

        if (!$vendor) {
            return Inertia::render('Vendor/Payment/LoadingPage', [
                'status' => 'error',
                'message' => 'Profil Vendor Anda tidak ditemukan. Silakan hubungi admin.'
            ]);
        }

        $vendorId = $vendor->id;

        if ($vendor->isApproved === 'PENDING' || $vendor->isApproved === 'REJECTED') {
            $status = strtolower($vendor->isApproved);
            $message = $status === 'pending'
                ? 'Akun Anda sedang dalam proses verifikasi oleh Administrator. Mohon tunggu.'
                : 'Pendaftaran Anda ditolak. Silakan hubungi admin untuk detail lebih lanjut.';

            return Inertia::render('Vendor/Payment/LoadingPage', [
                'status' => $status,
                'message' => $message
            ]);
        }

        // Foreign Key di tabel Order/Review ke Vendor
        $fkColumn = 'vendor_id';

        // Statistik dasar
        $priceColumn = 'total_price';

        $totalRevenue = Order::where($fkColumn, $vendorId)
            ->where('status', 'PAID')
            ->sum($priceColumn);

        $totalOrders = Order::where($fkColumn, $vendorId)->count();

        $reviewsQuery = Review::where($fkColumn, $vendorId);
        $totalReviews = $reviewsQuery->count();
        $averageRating = $reviewsQuery->avg('rating');

        /**
         * ==========================
         * FIX UTAMA: RECENT ORDERS
         * ==========================
         * - WAJIB select customer_id (jangan alias).
         * - Eager load customer akan berjalan normal.
         * - Jika frontend butuh user_id, buat properti tambahan.
         */
        $recentOrders = Order::where($fkColumn, $vendorId)
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->with(['customer:id,name']) // pastikan relasi Order::customer() benar
            ->select([
                'id',
                $priceColumn,
                'status',
                'created_at',
                'customer_id', // <-- INI YANG MEMPERBAIKI
            ])
            ->get()
            ->map(function ($order) use ($priceColumn) {
                // Konsistensi nilai di frontend
                $order->total_price = $order->{$priceColumn};

                // Kalau frontend Anda sebelumnya mengharapkan `user_id`, kita sediakan tanpa merusak `customer_id`
                $order->user_id = $order->customer_id;

                // Ambil nama customer dari relasi yang sudah ter-load
                $order->customer_name = $order->customer?->name ?? 'Pelanggan';

                return $order;
            });

        // Review terbaru
        $recentReviews = Review::where($fkColumn, $vendorId)
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->with(['user:id,name'])
            ->select('id', 'rating', 'comment', 'user_id')
            ->get()
            ->map(function ($review) {
                $review->customer_name = $review->user ? $review->user->name : 'Pengulas';
                return $review;
            });

        $stats = [
            'total_revenue' => $totalRevenue ?? 0,
            'total_orders' => $totalOrders ?? 0,
            'total_reviews' => $totalReviews ?? 0,
            'average_rating' => number_format($averageRating ?? 0, 1),
            'recent_orders' => $recentOrders,
            'recent_reviews' => $recentReviews,
        ];

        return Inertia::render('Vendor/Dashboard', [
            'vendor' => $vendor,
            'stats' => $stats,
            'message' => 'Selamat datang kembali di Dashboard Vendor!'
        ]);
    }
}

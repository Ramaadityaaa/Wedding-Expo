<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Order;
use App\Models\Review;

class DashboardController extends Controller
{
    public function verificationStatus(): Response|RedirectResponse
    {
        $user = Auth::user();
        $vendor = $user->vendor ?? $user->weddingOrganizer;

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
        $vendor = $user->vendor ?? $user->weddingOrganizer;

        if (!$vendor) {
            return Inertia::render('Vendor/Payment/LoadingPage', [
                'status' => 'error',
                'message' => 'Profil Vendor Anda tidak ditemukan. Silakan hubungi admin.'
            ]);
        }

        $vendorId = $vendor->id;

        if (in_array($vendor->isApproved, ['PENDING', 'REJECTED'], true)) {
            $status = strtolower($vendor->isApproved);
            $message = $status === 'pending'
                ? 'Akun Anda sedang dalam proses verifikasi oleh Administrator. Mohon tunggu.'
                : 'Pendaftaran Anda ditolak. Silakan hubungi admin untuk detail lebih lanjut.';

            return Inertia::render('Vendor/Payment/LoadingPage', [
                'status' => $status,
                'message' => $message
            ]);
        }

        $fkColumn = 'vendor_id';

        // Nominal utama: payment.amount, fallback: orders.total_price, fallback lagi: packages.price
        $amountExpr = "COALESCE(order_payments.amount, orders.total_price, packages.price, 0)";

        // A) Pendapatan semua order (agar benar-benar dinamis walau belum paid)
        $totalRevenueAll = DB::table('orders')
            ->leftJoin('order_payments', 'order_payments.order_id', '=', 'orders.id')
            ->leftJoin('packages', 'packages.id', '=', 'orders.package_id')
            ->where("orders.$fkColumn", $vendorId)
            ->sum(DB::raw($amountExpr));

        // B) Pendapatan hanya yang dianggap sudah menghasilkan revenue (paid/processed/completed), case-insensitive
        $totalRevenuePaid = DB::table('orders')
            ->leftJoin('order_payments', 'order_payments.order_id', '=', 'orders.id')
            ->leftJoin('packages', 'packages.id', '=', 'orders.package_id')
            ->where("orders.$fkColumn", $vendorId)
            ->where(function ($q) {
                $q->whereRaw("LOWER(orders.payment_status) = 'paid'")
                  ->orWhereRaw("LOWER(orders.status) IN ('processed','completed','success','paid')")
                  ->orWhereRaw("LOWER(order_payments.status) IN ('paid','verified','completed','success','settlement')");
            })
            ->sum(DB::raw($amountExpr));

        // Total pesanan
        $totalOrders = Order::where($fkColumn, $vendorId)->count();

        // Review stats
        $reviewsQuery = Review::where($fkColumn, $vendorId);
        $totalReviews = (int) $reviewsQuery->count();
        $averageRating = (float) ($reviewsQuery->avg('rating') ?? 0);

        // Recent orders
        $recentOrders = Order::where($fkColumn, $vendorId)
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->with(['customer:id,name'])
            ->select([
                'id',
                'total_price',
                'status',
                'payment_status',
                'created_at',
                'customer_id',
            ])
            ->get()
            ->map(function ($order) {
                $order->total_price = $order->total_price ?? 0;
                $order->user_id = $order->customer_id;
                $order->customer_name = $order->customer?->name ?? 'Pelanggan';
                return $order;
            });

        // Recent reviews
        $recentReviews = Review::where($fkColumn, $vendorId)
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->with(['user:id,name'])
            ->select('id', 'rating', 'comment', 'user_id')
            ->get()
            ->map(function ($review) {
                $review->customer_name = $review->user?->name ?? 'Pengulas';
                return $review;
            });

        // Pilihan output:
        // Jika Anda ingin card selalu bergerak mengikuti total order, pakai totalRevenueAll.
        // Jika ingin hanya paid, pakai totalRevenuePaid.
        $stats = [
            'total_revenue' => (float) ($totalRevenueAll ?? 0),        // <- ini yang paling “dinamis”
            'total_revenue_paid' => (float) ($totalRevenuePaid ?? 0),  // <- versi paid
            'total_orders' => (int) ($totalOrders ?? 0),
            'total_reviews' => (int) ($totalReviews ?? 0),
            'average_rating' => number_format($averageRating, 1),
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

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\WeddingOrganizer;
use App\Models\Review;
use App\Models\PaymentProof;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Menampilkan Dashboard Admin dengan statistik real-time dan daftar pending.
     */
    public function index(): Response
    {
        // 1. MENGHITUNG STATISTIK UTAMA

        // Vendor Stats
        $totalVendors = WeddingOrganizer::count();
        // Menggunakan 'PENDING' string karena tipe kolom ENUM
        $pendingVendorsCount = WeddingOrganizer::where('isApproved', 'PENDING')->count();
        $approvedVendors = WeddingOrganizer::where('isApproved', 'APPROVED')->count();

        // User Stats (Asumsi role customer adalah 'USER' atau NULL)
        $totalUsers = User::where(function ($q) {
            $q->where('role', 'USER')->orWhereNull('role');
        })->count();

        // Review Stats (Menggunakan kolom 'status')
        $totalReviews = Review::count();
        $pendingReviewsCount = Review::where('status', 'PENDING')->count();

        // Revenue Stats (Dari PaymentProof yang Approved)
        $totalRevenue = PaymentProof::where('status', 'Approved')->sum('amount');

        // Menghitung Pertumbuhan Bulanan (Revenue Bulan Ini vs Bulan Lalu)
        $currentMonthRevenue = PaymentProof::where('status', 'Approved')
            ->whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->sum('amount');

        $lastMonthRevenue = PaymentProof::where('status', 'Approved')
            ->whereMonth('created_at', Carbon::now()->subMonth()->month)
            ->whereYear('created_at', Carbon::now()->subMonth()->year)
            ->sum('amount');

        $monthlyGrowth = 0;
        if ($lastMonthRevenue > 0) {
            $monthlyGrowth = (($currentMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100;
        } elseif ($currentMonthRevenue > 0) {
            $monthlyGrowth = 100; // Pertumbuhan 100% jika bulan lalu 0
        }

        $stats = [
            'totalVendors'    => $totalVendors,
            'pendingVendors'  => $pendingVendorsCount,
            'approvedVendors' => $approvedVendors,
            'totalUsers'      => $totalUsers,
            'totalReviews'    => $totalReviews,
            'pendingReviews'  => $pendingReviewsCount,
            'totalRevenue'    => $totalRevenue,
            'monthlyGrowth'   => round($monthlyGrowth, 1), // Dibulatkan 1 desimal
        ];

        // 2. MENGAMBIL DATA LIST (Untuk Widget Tabel di Dashboard)

        // Ambil 5 vendor pending terbaru
        $pendingVendors = WeddingOrganizer::where('isApproved', 'PENDING')
            ->select('id', 'name', 'created_at', 'type', 'city')
            ->latest()
            ->take(5)
            ->get();

        // Ambil 5 review pending terbaru beserta relasinya
        $pendingReviews = Review::where('status', 'PENDING')
            ->with(['user:id,name', 'weddingOrganizer:id,name'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats'          => $stats,
            'pendingVendors' => $pendingVendors,
            'pendingReviews' => $pendingReviews,
        ]);
    }
}

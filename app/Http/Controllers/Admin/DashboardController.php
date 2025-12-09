<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Vendor; // <--- Ganti WeddingOrganizer jadi Vendor
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

        // Vendor Stats (Gunakan Model Vendor Baru)
        $totalVendors = Vendor::count();

        // Status di tabel vendors adalah string: 'pending' / 'active' (lowercase)
        $pendingVendorsCount = Vendor::where('status', 'pending')->count();
        $approvedVendors = Vendor::where('status', 'active')->count();

        // User Stats
        $totalUsers = User::where(function ($q) {
            $q->where('role', 'USER')->orWhereNull('role');
        })->count();

        // Review Stats (Kolom status sudah ditambahkan via migrasi)
        $totalReviews = Review::count();
        $pendingReviewsCount = Review::where('status', 'PENDING')->count();

        // Revenue Stats (Dari PaymentProof)
        $totalRevenue = PaymentProof::where('status', 'Approved')->sum('amount');

        // Menghitung Pertumbuhan Bulanan
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
            $monthlyGrowth = 100;
        }

        $stats = [
            'totalVendors'    => $totalVendors,
            'pendingVendors'  => $pendingVendorsCount,
            'approvedVendors' => $approvedVendors,
            'totalUsers'      => $totalUsers,
            'totalReviews'    => $totalReviews,
            'pendingReviews'  => $pendingReviewsCount,
            'totalRevenue'    => $totalRevenue,
            'monthlyGrowth'   => round($monthlyGrowth, 1),
        ];

        // 2. MENGAMBIL DATA LIST (Widget Tabel)

        // Ambil 5 vendor pending terbaru (Dari tabel vendors)
        $pendingVendors = Vendor::where('status', 'pending')
            ->select('id', 'name', 'created_at', 'address', 'phone') // Sesuaikan kolom yang ada di tabel vendors
            ->latest()
            ->take(5)
            ->get();

        // Ambil 5 review pending terbaru
        // PERBAIKAN PENTING: Relasi diganti dari 'weddingOrganizer' menjadi 'vendor'
        $pendingReviews = Review::where('status', 'PENDING')
            ->with(['user:id,name', 'vendor:id,name']) // <--- INI KUNCINYA
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

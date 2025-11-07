<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\WeddingOrganizer;
use App\Models\Review;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $totalVendors = WeddingOrganizer::count();
        $pendingVendorsCount = WeddingOrganizer::where('isApproved', false)->count();
        $totalUsers = User::where('role', 'VISITOR')->count();
        $totalReviews = Review::count();
        $pendingReviewsCount = Review::where('isApproved', false)->count();

        $stats = [
            'totalVendors' => $totalVendors,
            'pendingVendors' => $pendingVendorsCount,
            'approvedVendors' => $totalVendors - $pendingVendorsCount,
            'totalUsers' => $totalUsers,
            'totalReviews' => $totalReviews,
            'pendingReviews' => $pendingReviewsCount,
            'totalRevenue' => 0, // Ganti dengan logika Anda
            'monthlyGrowth' => 0, // Ganti dengan logika Anda
        ];

        // Ambil data untuk tabel, 'with' sangat penting untuk relasi
        $pendingVendors = WeddingOrganizer::where('isApproved', false)
                            ->latest()
                            ->get();
        
        $pendingReviews = Review::where('isApproved', false)
                            ->with(['user:id,name', 'weddingOrganizer:id,name']) // Ambil relasi
                            ->latest()
                            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'pendingVendors' => $pendingVendors,
            'pendingReviews' => $pendingReviews,
        ]);
    }
}
<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Menampilkan dashboard Vendor atau halaman verifikasi (LoadingPage).
     */
    public function index(): Response
    {
        $user = Auth::user();

        // Asumsi relasi vendor (WeddingOrganizer) ada di model User
        $vendor = $user->weddingOrganizer;

        // 1. Cek Data Profil (Seharusnya selalu ada setelah register fix)
        if (!$vendor) {
            return Inertia::render('Vendor/Payment/LoadingPage', [
                'status' => 'error',
                'message' => 'Profil Vendor Anda tidak ditemukan. Silakan hubungi admin.'
            ]);
        }

        // 2. Cek Status Verifikasi (isApproved: PENDING/APPROVED/REJECTED)

        // Status PENDING: Arahkan ke halaman tunggu/loading
        if ($vendor->isApproved === 'PENDING') {
            return Inertia::render('Vendor/Payment/LoadingPage', [
                'status' => 'pending',
                'message' => 'Akun Anda sedang dalam proses verifikasi oleh Administrator. Mohon tunggu.'
            ]);
        }

        // Status REJECTED: Arahkan ke halaman ditolak
        if ($vendor->isApproved === 'REJECTED') {
            return Inertia::render('Vendor/Payment/LoadingPage', [
                'status' => 'rejected',
                'message' => 'Pendaftaran Anda ditolak. Silakan hubungi admin untuk detail lebih lanjut.'
            ]);
        }

        // Status APPROVED: Tampilkan Dashboard utama
        return Inertia::render('Vendor/Dashboard', [
            'vendor' => $vendor, // Kirim data vendor untuk Layout
            'message' => 'Selamat datang kembali di Dashboard Vendor!'
        ]);
    }
}

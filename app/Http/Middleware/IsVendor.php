<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class IsVendor
{
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Pastikan pengguna sudah login
        if (!Auth::check()) {
            return redirect('/login'); // Redirect ke login jika belum autentikasi
        }

        $user = $request->user();

        // 2. Cek apakah role pengguna adalah 'VENDOR' (case insensitive comparison)
        // Kita bandingkan dengan huruf besar agar konsisten dengan data yang kita simpan ('VENDOR')
        if ($user && strtoupper($user->role) === 'VENDOR') {

            // [OPSIONAL FIX] Cek status persetujuan Vendor (seperti di VendorDashboardController)
            // Ini disarankan agar vendor yang PENDING tidak bisa akses fitur penuh
            $vendor = $user->weddingOrganizer;

            if ($vendor && $vendor->isApproved === 'APPROVED') {
                return $next($request);
            }

            // Jika role VENDOR tapi status PENDING/REJECTED/null:
            return redirect()->route('vendor.dashboard');
            // VendorDashboardController akan menangani redirect ke LoadingPage/RejectedPage

        }

        // Jika bukan vendor, lempar ke halaman 403 (Forbidden)
        abort(403, 'Akses Ditolak: Anda tidak memiliki hak akses Vendor.');
    }
}

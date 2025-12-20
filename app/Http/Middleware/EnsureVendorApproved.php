<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureVendorApproved
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        // 1. Cek apakah user login dan memiliki role VENDOR
        if ($user && $user->role === 'VENDOR') {
            
            // Ambil profil vendor
            $vendor = $user->vendor;

            // 2. Cek status approval
            if (!$vendor || $vendor->isApproved !== 'APPROVED') {
                
                // PENTING: Cegah loop jika user sudah berada di halaman verifikasi
                if ($request->routeIs('vendor.verification')) {
                    return $next($request);
                }

                return redirect()->route('vendor.verification');
            }
        }

        return $next($request);
    }
}
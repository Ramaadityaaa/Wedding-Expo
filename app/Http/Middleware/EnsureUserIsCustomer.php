<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class EnsureUserIsCustomer
{
    public function handle(Request $request, Closure $next): Response
    {
        // Memeriksa apakah pengguna sudah login dan peran pengguna adalah 'CUSTOMER'
        if (Auth::check() && Auth::user()->role !== 'CUSTOMER') {
            // Jika peran bukan CUSTOMER, akses ditolak
            abort(403, 'Akses ditolak: ROLE CUSTOMER DIPERLUKAN');
        }

        return $next($request);
    }
}

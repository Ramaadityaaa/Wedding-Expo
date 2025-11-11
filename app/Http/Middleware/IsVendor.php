<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsVendor
{
    public function handle(Request $request, Closure $next): Response
    {
        // Asumsi Anda punya kolom 'role' di tabel 'users'
        if ($request->user() && $request->user()->role == 'vendor') {
            return $next($request);
        }

        // Jika bukan vendor, lempar ke halaman 403 (Forbidden)
        abort(403, 'Akses Ditolak');
    }
}
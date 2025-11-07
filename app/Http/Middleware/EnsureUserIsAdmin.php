<?php

// app/Http/Middleware/EnsureUserIsAdmin.php
namespace App\Http\Middleware; // <-- Pastikan namespace-nya seperti ini

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Cek jika pengguna terautentikasi DAN role-nya adalah ADMIN
        if ($request->user() && $request->user()->role === 'ADMIN') {
            return $next($request);
        }

        // Jika tidak, tolak akses (Forbidden)
        abort(403, 'ACCESS DENIED. ADMIN ROLE REQUIRED.');
    }
    
    // <-- Pastikan tidak ada fungsi 'handle' lain di bawah sini
}
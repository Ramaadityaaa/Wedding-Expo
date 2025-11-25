<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;

class UserStatsController extends Controller
{
    public function index()
    {
        return response()->json([
            'total_users' => User::count(),

            // Misal user aktif = sudah verifikasi email
            'active_users' => User::whereNotNull('email_verified_at')->count(),

            // Jika kamu ingin pakai "last login" (kalau punya kolom)
            // 'active_users' => User::where('last_login', '>=', now()->subDays(7))->count(),
        ]);
    }
}

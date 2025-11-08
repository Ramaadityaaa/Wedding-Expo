<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\WeddingOrganizer; // <-- Pastikan ini di-import
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;

class HomeController extends Controller
{
    /**
     * Menampilkan halaman utama (dashboard customer)
     */
    public function index(): Response
    {
        // 1. Ambil data vendor
        $vendors = WeddingOrganizer::where('isApproved', true)
                            ->latest()
                            ->take(12)
                            ->get();

        // 2. Render halaman React Anda di lokasi BARU
        // --- INI PERBAIKANNYA ---
        return Inertia::render('Customer/Dashboard', [ // <-- Diubah dari 'Welcome'
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'vendors' => $vendors // <-- Kirim props ini ke React
        ]);
    }
}
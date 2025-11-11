<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\WeddingOrganizer; // Pastikan ini di-import
use Illuminate\Support\Facades\Route;

class HomeController extends Controller
{
    /**
     * Menampilkan halaman utama (dashboard customer)
     */
    public function index(): Response
    {
        $vendors = WeddingOrganizer::where('isApproved', true)
                                   ->latest()
                                   ->take(12) 
                                   ->get();

        return Inertia::render('Customer/Dashboard', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'vendors' => $vendors
        ]);
    }

    /**
     * Menampilkan halaman detail untuk satu vendor.
     */
    public function show(WeddingOrganizer $vendor): Response
    {
        if (!$vendor->isApproved) {
            abort(404);
        }

        // Anda perlu membuat file: resources/js/Pages/Customer/VendorDetail.jsx
        return Inertia::render('Customer/VendorDetail', [
            'vendor' => $vendor,
        ]);
    }

    /**
     * Menampilkan semua vendor (halaman /vendors)
     */
    public function allVendors(): Response
    {
        $allVendors = WeddingOrganizer::where('isApproved', true)
                                    ->orderBy('name')
                                    ->paginate(16); 

        // Anda perlu membuat file: resources/js/Pages/Customer/AllVendors.jsx
        return Inertia::render('Customer/AllVendors', [
            'vendors' => $allVendors,
        ]);
    }

    /**
     * Menampilkan halaman Favorit (halaman /favorit)
     */
    public function favorites(): Response
    {
        // Logika untuk mengambil vendor favorit...
        $favoriteVendors = []; // Ganti ini dengan logika Anda

        // Anda perlu membuat file: resources/js/Pages/Customer/Favorites.jsx
        return Inertia::render('Customer/Favorites', [
            'vendors' => $favoriteVendors,
        ]);
    }

    /**
     * Menampilkan halaman Tentang (halaman /tentang)
     */
    public function about(): Response
    {
        // Anda perlu membuat file: resources/js/Pages/Customer/About.jsx
        return Inertia::render('Customer/About');
    }
}
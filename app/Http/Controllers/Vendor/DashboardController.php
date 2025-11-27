<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Menampilkan dashboard untuk vendor.
     */
    public function index(): Response
    {
        // Ini akan memuat file React
        return Inertia::render('Vendor/Dashboard', [
            
            // Kita kirim array kosong sebagai 'props' dummy
            // agar React tidak error
            'products' => [], 
            'orders' => []
            
        ]);
    }
}
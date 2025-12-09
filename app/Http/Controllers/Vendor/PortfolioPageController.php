<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PortfolioPageController extends Controller
{
    public function index()
    {
        // Data di sini akan digunakan di Pages/Vendor/pages/PortfolioPage.jsx
        return Inertia::render('Vendor/pages/PortfolioPage', [
            'message' => 'Halaman Manajemen Portofolio Vendor',
        ]);
    }
}

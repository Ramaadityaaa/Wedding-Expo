<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PackagePageController extends Controller
{
    public function index()
    {
        // Data di sini akan digunakan di Pages/Vendor/pages/PackagePage.jsx
        return Inertia::render('Vendor/pages/PackagePage', [
            'message' => 'Halaman Manajemen Paket Vendor',
        ]);
    }
}

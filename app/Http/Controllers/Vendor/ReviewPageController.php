<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewPageController extends Controller
{
    public function index()
    {
        // Data di sini akan digunakan di Pages/Vendor/pages/ReviewPage.jsx
        return Inertia::render('Vendor/pages/ReviewPage', [
            'message' => 'Halaman Tinjau Ulasan Vendor',
        ]);
    }
}

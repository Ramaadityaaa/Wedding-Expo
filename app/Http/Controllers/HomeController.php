<?php

namespace App\Http\Controllers;

use App\Models\User; 
use App\Models\WeddingOrganizer; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash; 
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str; 
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse; // Pastikan ini ada

class HomeController extends Controller
{
    /**
     * Menampilkan halaman utama (dashboard customer)
     * Ini me-render: resources/js/Pages/Customer/Dashboard.jsx
     */
    public function index(): Response
    {
        $vendors = WeddingOrganizer::where('isApproved', true)
                                     ->latest()
                                     ->take(12) 
                                     ->get();

        // Path ini sudah benar sesuai struktur folder Anda
        return Inertia::render('Customer/Dashboard', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'vendors' => $vendors
        ]);
    }

    // ====================================================================
    // --- FUNGSI REGISTRASI (PATH DIPERBAIKI) ---
    // ====================================================================

    /**
     * Menampilkan halaman registrasi vendor.
     * Ini me-render: resources/js/Pages/Auth/Vendor/RegisterPage.jsx
     */
    public function vendorRegister()
    {
        // --- PERBAIKAN: Path ini disesuaikan dengan screenshot folder Anda ---
        return Inertia::render('Auth/Vendor/RegisterPage');
    }

    /**
     * Menyimpan data vendor baru dari form registrasi.
     */
    public function vendorStore(Request $request)
    {
        // 1. Validasi data
        $validatedData = $request->validate([
            'companyName' => 'required|string|max:255',
            'vendorType' => 'required|string',
            'city' => 'required|string|max:255',
            'permitNumber' => 'required|string|max:255|unique:wedding_organizers,permit_number', 
            'fullName' => 'required|string|max:255',
            'email' => 'required|email|max:255', // Hapus unique:users,email jika tidak ada tabel User
            'phone' => 'required|string|max:20',
            'terms' => 'accepted',
            'permitImage' => 'required|file|mimes:jpg,png,pdf|max:5120', 
        ]);
        
        // 3. Upload file
        $path = $request->file('permitImage')->store('permit_images', 'public');

        // 4. Buat vendor baru
        $vendor = new WeddingOrganizer(); 
        // $vendor->user_id = $user->id; // Aktifkan jika Anda membuat user baru
        $vendor->name = $validatedData['companyName']; 
        $vendor->type = $validatedData['vendorType']; 
        $vendor->city = $validatedData['city'];
        $vendor->permit_number = $validatedData['permitNumber'];
        $vendor->contact_name = $validatedData['fullName'];
        $vendor->contact_email = $validatedData['email'];
        $vendor->contact_phone = $validatedData['phone'];
        $vendor->permit_image_path = $path;
        $vendor->isApproved = false; // Set status awal ke pending
        $vendor->save();

        // 6. Kembalikan ke halaman sukses
        return redirect()->back(); 
    }
}
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Vendor; // <--- UBAH INI: Pakai Model Vendor (bukan WeddingOrganizer)
use App\Http\Requests\VendorRegistrationRequest;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class VendorRegistrationController extends Controller
{
    /**
     * Menampilkan form registrasi vendor.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Vendor/RegisterPage');
    }

    /**
     * Menangani proses pendaftaran vendor.
     */
    public function store(VendorRegistrationRequest $request): RedirectResponse
    {
        // 1) Simpan data ke tabel 'users' (Login Info)
        $user = User::create([
            'name'     => $request->name,  // Nama Kontak Person
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'phone'    => $request->phone,
            'role'     => 'VENDOR',
            'status'   => 'Active', // Pastikan user login aktif
        ]);

        // 2) Upload file permit_image (Izin Usaha)
        $permitPath = null;
        if ($request->hasFile('permit_image')) {
            $permitPath = $request->file('permit_image')->store('vendor/permits', 'public');
        }

        // 3) Simpan data bisnis ke tabel 'VENDORS'
        // PENTING: Kita pakai Vendor::create agar sinkron dengan fitur pembayaran
        Vendor::create([
            'user_id'     => $user->id,

            // Mapping Data Bisnis
            'name'        => $request->company_name, // Nama Vendor / Usaha
            'type'        => $request->vendor_type,  // Jenis Vendor (Pastikan kolom 'type' ada di tabel vendors)
            'city'        => $request->city,
            'address'     => $request->address,
            'phone'       => $request->phone,        // Nomor Telepon Bisnis

            // Kontak Person 
            // (Sesuaikan nama kolom di database kamu: 'contact', 'contact_name', atau 'owner')
            'contact_name' => $request->name,
            'contact_email' => $request->email,

            // Legalitas
            'permit_number'     => $request->permit_number,
            'permit_image_path' => $permitPath,

            // --- AUTO APPROVED (STRING) ---
            'isApproved'       => 'PENDING', // Langsung Approved (String)
            'status'           => 'Active',   // Status Aktif
            'rejection_reason' => null,
        ]);

        // 4) Event pendaftaran
        event(new Registered($user));

        // 5) Login otomatis
        Auth::login($user);

        // 6) Redirect LANGSUNG ke Dashboard (Karena sudah Approved)
        return redirect()->route('vendor.dashboard')
            ->with('message', 'Pendaftaran berhasil! Akun Anda telah aktif.');
    }
}

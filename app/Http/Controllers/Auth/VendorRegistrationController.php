<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\WeddingOrganizer;
use App\Http\Requests\VendorRegistrationRequest;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
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
        // 1. Simpan data ke tabel 'users' dengan role VENDOR
        $user = User::create([
            'name'     => $request->name, // Nama kontak person
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'phone'    => $request->phone, // Nomor WhatsApp
            'role'     => 'VENDOR',
        ]);

        // 2. Handle upload file permit_image (Izin Usaha)
        $permitPath = null;
        if ($request->hasFile('permit_image')) {
            $permitPath = $request->file('permit_image')->store('vendor/permits', 'public');
        }

        // 3. Simpan data bisnis ke tabel 'wedding_organizers'
        WeddingOrganizer::create([
            'user_id'       => $user->id,
            'company_name'  => $request->company_name,
            'vendor_type'   => $request->vendor_type,
            'city'          => $request->city,
            'address'       => $request->address,
            'permit_number' => $request->permit_number,
            'permit_image'  => $permitPath,
            'isApproved'    => 'PENDING', // Status awal pendaftaran
        ]);

        // 4. Memicu event pendaftaran (opsional, untuk kirim email verifikasi)
        event(new Registered($user));

        // 5. Otomatis Login setelah daftar agar vendor tidak perlu ke halaman login lagi
        Auth::login($user);

        // 6. REDIRECT ke rute status verifikasi (Halaman Tunggu)
        return redirect()->route('vendor.verification')
            ->with('message', 'Pendaftaran berhasil! Akun Anda sedang ditinjau oleh tim kami.');
    }
}
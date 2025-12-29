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
        // 1) Simpan data ke tabel 'users'
        $user = User::create([
            'name'     => $request->name,  // nama kontak person
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'phone'    => $request->phone,
            'role'     => 'VENDOR',
        ]);

        // 2) Upload file permit_image (Izin Usaha)
        $permitPath = null;
        if ($request->hasFile('permit_image')) {
            $permitPath = $request->file('permit_image')->store('vendor/permits', 'public');
        }

        // 3) Simpan data bisnis ke tabel 'wedding_organizers'
        WeddingOrganizer::create([
            'user_id'           => $user->id,

            // sesuaikan dengan fillable WeddingOrganizer Anda
            'name'              => $request->company_name,   // NAMA VENDOR / NAMA USAHA
            'type'              => $request->vendor_type,    // JENIS VENDOR

            'city'              => $request->city,
            'address'           => $request->address,

            'permit_number'     => $request->permit_number,
            'permit_image_path' => $permitPath,              // INI YANG BENAR

            // info kontak vendor (opsional tapi bagus untuk admin)
            'contact_name'      => $request->name,
            'contact_email'     => $request->email,
            'contact_phone'     => $request->phone,

            'isApproved'        => 'PENDING',
        ]);

        // 4) event pendaftaran (opsional)
        event(new Registered($user));

        // 5) login otomatis
        Auth::login($user);

        // 6) redirect status verifikasi
        return redirect()->route('vendor.verification')
            ->with('message', 'Pendaftaran berhasil! Akun Anda sedang ditinjau oleh tim kami.');
    }
}

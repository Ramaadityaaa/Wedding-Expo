<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        // Fungsi ini merender halaman React 'Profile/Edit'
        // Catatan: Jika Anda menggunakan halaman yang berbeda untuk Vendor (misalnya 'Vendor/ProfileEdit'),
        // Anda mungkin perlu menyesuaikan logic di sini berdasarkan role user, atau membuat Controller terpisah.
        
        // Memastikan rute render adalah yang benar untuk Vendor.
        // Jika Anda menggunakan halaman Vendor, pastikan 'Vendor/pages/ProfileEdit' atau sejenisnya.
        // Asumsi: 'Profile/Edit' adalah komponen yang menangani tampilan Vendor/Customer.
        
        return Inertia::render('Profile/Edit', [
            // Memuat props yang dibutuhkan oleh halaman
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        // 1. Mengisi data yang divalidasi ke user
        $request->user()->fill($request->validated());

        // 2. Jika email diubah, set email_verified_at menjadi null (membutuhkan verifikasi ulang)
        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        // 3. Menyimpan data ke database
        $request->user()->save();

        // 4. Redirect ke rute edit dengan status sukses.
        // PERBAIKAN: Menggunakan rute Vendor agar tidak terjadi RouteNotFoundException
        return Redirect::route('vendor.profile.edit')->with('status', 'profile-updated'); 
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
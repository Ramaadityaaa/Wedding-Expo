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
        $user = $request->user();

        // LOGIKA PEMISAHAN VIEW:
        // 1. Vendor   -> Pakai 'Profile/Edit' (Yang ada Sidebar & Smart Layout tadi)
        // 2. Customer -> Pakai 'Customer/Profile/Edit' (Yang pakai Navbar & Footer)

        $component = ($user->role === 'VENDOR')
            ? 'Profile/Edit'
            : 'Customer/Profile/Edit';

        return Inertia::render($component, [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information (Login Info: Name & Email).
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();

        $user->fill($request->validated());

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        // Redirect Cerdas: Tetap di route profil masing-masing role agar sidebar tidak hilang
        if ($user->role === 'VENDOR') {
            return Redirect::route('vendor.profile.edit')->with('status', 'profile-updated');
        }

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    /**
     * Update Data Bisnis Vendor (Khusus Vendor).
     */
    public function updateBusiness(Request $request)
    {
        // Pastikan user punya relasi vendor
        $vendor = $request->user()->vendor;

        if (!$vendor) {
            return back()->with('error', 'Data vendor tidak ditemukan.');
        }

        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'vendor_type'   => 'required|string',
            'whatsapp'      => 'required|string|max:20',
            'city'          => 'required|string|max:255',
            'province'      => 'required|string|max:255',
            'address'       => 'required|string',
            'pic_name'      => 'required|string|max:255',
            // Tambahkan validasi lain jika perlu (permit number, dll)
        ]);

        $vendor->update($validated);

        return back()->with('success', 'Informasi bisnis berhasil diperbarui.');
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

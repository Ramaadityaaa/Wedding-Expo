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
     * Role aware:
     * - Customer: resources/js/Pages/Customer/Profile/Edit.jsx
     * - Vendor: resources/js/Pages/Vendor/pages/ProfilePage.jsx (atau sesuaikan)
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        // Pilih komponen Inertia berdasarkan role
        // Sesuaikan nilai role jika di database Anda memakai "USER" atau "CUSTOMER"
        $component = ($user && $user->role === 'VENDOR')
            ? 'Vendor/pages/ProfilePage'
            : 'Customer/Profile/Edit';

        return Inertia::render($component, [
            'user' => $user,
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();

        $user->fill($request->validated());

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        // Redirect sesuai role
        if ($user->role === 'VENDOR') {
            return Redirect::route('vendor.profile.edit')->with('status', 'profile-updated');
        }

        return Redirect::route('customer.profile.edit')->with('status', 'profile-updated');
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

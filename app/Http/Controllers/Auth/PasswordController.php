<?php

// app/Http/Controllers/Auth/PasswordController.php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class PasswordController extends Controller
{
    /**
     * Update the user's password.
     */
    public function update(Request $request): RedirectResponse
    {
        // Kunci Dinamis: Validasi dan update password di database
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            // Pastikan Anda telah mengimpor dan menggunakan rule Password::defaults() dengan benar
            'password' => ['required', Password::defaults(), 'confirmed'], 
        ]);

        $request->user()->update([
            // --- DATABASE SAVE (Hashing) ---
            'password' => Hash::make($validated['password']),
        ]);

        // Kunci Dinamis: Mengembalikan kembali ke halaman sebelumnya
        // back() akan memicu `recentlySuccessful` di frontend dan me-reset field.
        return back()->with('status', 'password-updated');
    }
}
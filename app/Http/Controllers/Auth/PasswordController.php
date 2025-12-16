<?php

// app/Http/Controllers/Auth/PasswordController.php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password; // Pastikan ini di-import

class PasswordController extends Controller
{
    /**
     * Update the user's password.
     */
    public function update(Request $request): RedirectResponse
    {
        // --- 1. VALIDASI DATA DENGAN CUSTOM MESSAGES ---
        $validated = $request->validate([
            // Rule 'current_password' memeriksa kecocokan dengan password user saat ini
            'current_password' => ['required', 'current_password'],
            
            // Rule 'confirmed' memeriksa kesamaan dengan 'password_confirmation'
            'password' => ['required', 'string', Password::defaults(), 'confirmed'], 
        ], [
            // Pesan Kustom untuk Validasi
            'current_password.required' => 'Password lama wajib diisi.',
            'current_password.current_password' => 'Password lama yang dimasukkan salah.', // Disesuaikan
            'password.required' => 'Password baru wajib diisi.',
            'password.confirmed' => 'Konfirmasi password baru harus sama.', // Disesuaikan
            'password.min' => 'Password minimal harus :min karakter.', // Contoh default
        ]);

        // --- 2. UPDATE PASSWORD DI DATABASE ---
        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        // --- 3. REDIRECT SUKSES ---
        // back() akan kembali ke /vendor/profile dengan status 'password-updated'
        return back()->with('status', 'password-updated');
    }
}
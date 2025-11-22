<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Tampilkan halaman register (Customer).
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Customer/RegisterPage');
    }

    /**
     * Proses penyimpanan data registrasi.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            // 'role'   => 'VISITOR', // kalau mau kasih default role
        ]);

        event(new Registered($user));

        // ⛔ JANGAN auto login
        // Auth::login($user);

        // ✅ Paksa user login dengan akun yang baru dibuat
        return redirect()
            ->route('login')
            ->with('status', 'Akun berhasil dibuat. Silakan login dengan email dan password yang baru Anda daftarkan.');
    }
}

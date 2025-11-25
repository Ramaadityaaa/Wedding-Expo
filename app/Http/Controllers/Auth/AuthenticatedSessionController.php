<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Tampilkan halaman login.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/LoginPage', [ // <-- SAMAKAN dengan nama file JSX
            'canResetPassword' => Route::has('password.request'),
            'status'           => session('status'),
        ]);
    }

    /**
     * Proses permintaan login.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        // validasi + autentikasi (pakai LoginRequest bawaan Breeze)
        $request->authenticate();

        // regenerate session ID untuk keamanan
        $request->session()->regenerate();

        // arahkan ke HOME (biasanya /dashboard, sesuai RouteServiceProvider::HOME)
        return redirect()->intended(RouteServiceProvider::HOME);
    }

    /**
     * Logout user yang sedang login.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // setelah logout, balik ke halaman utama (boleh juga ->route('login'))
        return redirect('/');
    }
}

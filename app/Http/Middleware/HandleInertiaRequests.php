<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [

            // --- DATA USER & VENDOR (SINKRONISASI DATA) ---
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role,

                    // Foto Profil (Support Jetstream atau null)
                    'profile_photo_url' => $request->user()->profile_photo_url ?? null,

                    // --- PENTING: RELASI VENDOR ---
                    // Mengambil data vendor terbaru dari relasi User -> Vendor
                    'vendor' => $request->user()->vendor ? [
                        'id' => $request->user()->vendor->id,
                        'user_id' => $request->user()->vendor->user_id, // Penting untuk Chat
                        'name' => $request->user()->vendor->name,
                        'status' => $request->user()->vendor->isApproved, // <--- INI KUNCI STATUS SIDEBAR
                        'logo' => $request->user()->vendor->logo,
                        'role' => $request->user()->vendor->role,
                    ] : null,
                ] : null,
            ],

            // --- ZIGGY (ROUTE HELPER) ---
            'ziggy' => fn() => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],

            // --- FLASH MESSAGES ---
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
            ],
        ]);
    }
}

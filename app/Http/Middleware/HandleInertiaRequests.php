<?php

namespace App\Http\Middleware;

use App\Models\Favorite;
use App\Models\StaticContent;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [

            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role,

                    'profile_photo_url' => $request->user()->profile_photo_url ?? null,

                    'vendor' => $request->user()->vendor ? [
                        'id' => $request->user()->vendor->id,
                        'user_id' => $request->user()->vendor->user_id,
                        'name' => $request->user()->vendor->name,
                        'status' => $request->user()->vendor->isApproved,
                        'logo' => $request->user()->vendor->logo,
                        'role' => $request->user()->vendor->role,
                    ] : null,
                ] : null,
            ],

            // badge favorit untuk navbar
            'favoritesCount' => fn () => $request->user()
                ? Favorite::where('user_id', $request->user()->id)->count()
                : 0,

            // >>> INI YANG BARU: Share static content untuk semua page (Footer, dsb.)
            'staticContent' => fn () => StaticContent::query()
                ->pluck('content', 'key')
                ->toArray(),

            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],

            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ]);
    }
}

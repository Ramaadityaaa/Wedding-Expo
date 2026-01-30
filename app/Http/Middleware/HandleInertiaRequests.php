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

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        return array_merge(parent::share($request), [

            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'profile_photo_url' => $user->profile_photo_url ?? null,

                    'vendor' => $user->vendor ? [
                        'id' => $user->vendor->id,
                        'user_id' => $user->vendor->user_id,
                        'name' => $user->vendor->name,
                        'isApproved' => $user->vendor->isApproved, // sumber kebenaran approval kamu
                        'logo' => $user->vendor->logo,
                        'role' => $user->vendor->role,
                    ] : null,
                ] : null,
            ],

            'favoritesCount' => fn () => $user
                ? Favorite::where('user_id', $user->id)->count()
                : 0,

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

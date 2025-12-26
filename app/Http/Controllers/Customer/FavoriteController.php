<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use App\Models\WeddingOrganizer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $favorites = [];
        if ($user) {
            $favorites = Favorite::query()
                ->where('user_id', $user->id)
                ->with([
                    'weddingOrganizer' => function ($q) {
                        $q->withCount(['reviews', 'packages'])
                          ->with(['reviews' => function ($r) {
                              $r->select('id', 'vendor_id', 'rating');
                          }]);
                    }
                ])
                ->latest()
                ->get()
                ->map(function (Favorite $fav) {
                    $vendor = $fav->weddingOrganizer;
                    if (!$vendor) return null;

                    $avgRating = 0;
                    if ($vendor->reviews_count > 0) {
                        $sum = $vendor->reviews->sum('rating');
                        $avgRating = round($sum / $vendor->reviews_count, 1);
                    }

                    return [
                        'favorite_id' => $fav->id,
                        'id' => $vendor->id,
                        'name' => $vendor->name,
                        'type' => $vendor->type,
                        'city' => $vendor->city,
                        'province' => $vendor->province,
                        'address' => $vendor->address,
                        'logo' => $vendor->logo,
                        'coverPhoto' => $vendor->coverPhoto,
                        'packages_count' => $vendor->packages_count,
                        'reviews_count' => $vendor->reviews_count,
                        'avg_rating' => $avgRating,
                    ];
                })
                ->filter()
                ->values()
                ->toArray();
        }

        return Inertia::render('Customer/FavoritePage', [
            'favorites' => $favorites,
        ]);
    }

    public function toggle(Request $request, $vendor)
    {
        $user = $request->user();
        if (!$user) {
            abort(403, 'Unauthorized');
        }

        $vendorModel = WeddingOrganizer::findOrFail($vendor);

        // FIX: pakai vendor_id (sesuai struktur tabel favorites)
        $existing = Favorite::query()
            ->where('user_id', $user->id)
            ->where('vendor_id', $vendorModel->id)
            ->first();

        if ($existing) {
            $existing->delete();
            return back()->with('success', 'Vendor dihapus dari favorit.');
        }

        Favorite::create([
            'user_id' => $user->id,
            'vendor_id' => $vendorModel->id,
        ]);

        return back()->with('success', 'Vendor ditambahkan ke favorit.');
    }

    public function destroy(Request $request, $vendor)
    {
        $user = $request->user();
        if (!$user) {
            abort(403, 'Unauthorized');
        }

        // FIX: pakai vendor_id
        Favorite::query()
            ->where('user_id', $user->id)
            ->where('vendor_id', $vendor)
            ->delete();

        return back()->with('success', 'Vendor dihapus dari favorit.');
    }
}

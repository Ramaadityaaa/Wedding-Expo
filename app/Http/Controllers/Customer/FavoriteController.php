<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use App\Models\Vendor;
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
                    'vendor' => function ($q) {
                        // sesuaikan relasi yang memang ada di model Vendor kamu
                        $q->withCount(['reviews', 'packages'])
                          ->withAvg('reviews', 'rating')
                          ->with(['portfolios' => function ($p) {
                              $p->latest();
                          }]);
                    }
                ])
                ->latest()
                ->get()
                ->map(function (Favorite $fav) {
                    $vendor = $fav->vendor;
                    if (!$vendor) return null;

                    $portfolio = $vendor->relationLoaded('portfolios')
                        ? $vendor->portfolios->first()
                        : null;

                    // cover photo: coba beberapa kemungkinan nama field supaya tidak error
                    $portfolioPath = null;
                    if ($portfolio) {
                        $portfolioPath =
                            $portfolio->imageUrl
                            ?? $portfolio->image_path
                            ?? $portfolio->image_url
                            ?? $portfolio->path
                            ?? $portfolio->image
                            ?? null;
                    }

                    $coverPhoto = $portfolioPath
                        ? (str_starts_with($portfolioPath, 'http') ? $portfolioPath : \Storage::url($portfolioPath))
                        : null;

                    return [
                        'favorite_id' => $fav->id,
                        'id' => $vendor->id,
                        'name' => $vendor->name,
                        'type' => $vendor->role ?? 'Vendor', // dulu kamu pakai $vendor->type, di tabel vendors tidak ada kolom type
                        'city' => $vendor->city,
                        'province' => $vendor->province,
                        'address' => $vendor->address,
                        'logo' => $vendor->logo,
                        'coverPhoto' => $coverPhoto,
                        'packages_count' => (int) ($vendor->packages_count ?? 0),
                        'reviews_count' => (int) ($vendor->reviews_count ?? 0),
                        'avg_rating' => $vendor->reviews_avg_rating
                            ? round((float) $vendor->reviews_avg_rating, 1)
                            : 0,
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

    /**
     * Toggle favorit: POST /favorites/{vendor}/toggle
     * FIX UTAMA: pakai Vendor model binding, bukan WeddingOrganizer
     */
    public function toggle(Request $request, Vendor $vendor)
    {
        $user = $request->user();
        if (!$user) {
            abort(403, 'Unauthorized');
        }

        // opsional: batasi hanya vendor approved bisa difavoritkan
        if ($vendor->isApproved !== 'APPROVED') {
            return back()->with('error', 'Vendor belum terverifikasi.');
        }

        $existing = Favorite::query()
            ->where('user_id', $user->id)
            ->where('vendor_id', $vendor->id)
            ->first();

        if ($existing) {
            $existing->delete();
            return back()->with('success', 'Vendor dihapus dari favorit.');
        }

        Favorite::create([
            'user_id' => $user->id,
            'vendor_id' => $vendor->id,
        ]);

        return back()->with('success', 'Vendor ditambahkan ke favorit.');
    }

    /**
     * Delete favorit: DELETE /favorites/{vendor}
     */
    public function destroy(Request $request, Vendor $vendor)
    {
        $user = $request->user();
        if (!$user) {
            abort(403, 'Unauthorized');
        }

        Favorite::query()
            ->where('user_id', $user->id)
            ->where('vendor_id', $vendor->id)
            ->delete();

        return back()->with('success', 'Vendor dihapus dari favorit.');
    }
}

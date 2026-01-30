<?php

namespace App\Http\Controllers;

use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class VendorController extends Controller
{
    /**
     * HALAMAN SEMUA VENDOR (PUBLIC) - Inertia Page: GET /vendors
     */
    public function publicIndexPage(Request $request)
    {
        try {
            $q = trim((string) $request->query('q', ''));
            $sort = (string) $request->query('sort', 'rating');

            if (!in_array($sort, ['rating', 'newest', 'name'], true)) {
                $sort = 'rating';
            }

            $query = Vendor::query()
                ->where('isApproved', 'APPROVED')
                ->withAvg('reviews', 'rating')
                ->withCount('reviews')
                ->with(['portfolios' => function ($q) {
                    $q->latest();
                }]);

            if ($q !== '') {
                $query->where(function ($w) use ($q) {
                    $w->where('name', 'like', '%' . $q . '%')
                      ->orWhere('city', 'like', '%' . $q . '%');
                });
            }

            switch ($sort) {
                case 'newest':
                    $query->reorder()->orderByDesc('created_at');
                    break;

                case 'name':
                    $query->reorder()->orderBy('name');
                    break;

                case 'rating':
                default:
                    $query->reorder()
                        ->orderByDesc('reviews_avg_rating')
                        ->orderByDesc('created_at');
                    break;
            }

            $vendorsPaginator = $query->paginate(12)->withQueryString();

            $vendorsPaginator->setCollection(
                $vendorsPaginator->getCollection()->map(function ($vendor) {
                    $portfolio = $vendor->relationLoaded('portfolios')
                        ? $vendor->portfolios->first()
                        : null;

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

                    $coverPhoto = null;
                    if (!empty($portfolioPath)) {
                        if (Str::startsWith($portfolioPath, ['http://', 'https://'])) {
                            $coverPhoto = $portfolioPath;
                        } else {
                            $coverPhoto = Storage::url($portfolioPath);
                        }
                    }

                    return [
                        'id' => $vendor->id,
                        'name' => $vendor->name,
                        'city' => $vendor->city ?? 'Indonesia',
                        'description' => $vendor->description,
                        'coverPhoto' => $coverPhoto,
                        'rating' => $vendor->reviews_avg_rating
                            ? number_format((float) $vendor->reviews_avg_rating, 1)
                            : 0,
                        'reviewCount' => (int) ($vendor->reviews_count ?? 0),
                        'isVerified' => true,
                    ];
                })
            );

            return Inertia::render('Customer/Vendors/Index', [
                'vendors' => $vendorsPaginator,
                'filters' => [
                    'q' => $q,
                    'sort' => $sort,
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error('Error rendering public vendors page:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            abort(500, 'Gagal memuat halaman vendor.');
        }
    }

    /**
     * Mengambil daftar vendor yang sudah diverifikasi (APPROVED) untuk tampilan publik (GET /api/vendors).
     */
    public function index(Request $request)
    {
        try {
            $vendors = Vendor::query()
                ->where('isApproved', 'APPROVED')
                ->withAvg('reviews', 'rating')
                ->withCount('reviews')
                ->orderByDesc('created_at')
                ->paginate(10);

            return response()->json([
                'message' => 'Daftar Vendor berhasil diambil',
                'data' => $vendors->items(),
                'pagination' => [
                    'total' => $vendors->total(),
                    'per_page' => $vendors->perPage(),
                    'current_page' => $vendors->currentPage(),
                    'last_page' => $vendors->lastPage(),
                ],
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Error fetching public vendor index:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['message' => 'Internal server error. Gagal memuat data.'], 500);
        }
    }

    /**
     * Menampilkan detail satu vendor (GET /api/vendors/{vendor}).
     * Route model binding harus Vendor, bukan WeddingOrganizer.
     */
    public function show(Vendor $vendor)
    {
        try {
            if ($vendor->isApproved !== 'APPROVED') {
                return response()->json(['message' => 'Vendor tidak ditemukan atau belum diverifikasi.'], 404);
            }

            $vendor->load(['packages', 'reviews']);

            return response()->json([
                'message' => 'Detail Vendor berhasil diambil',
                'data' => $vendor,
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Error fetching public vendor details:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['message' => 'Internal server error. Gagal memuat detail vendor.'], 500);
        }
    }

    /**
     * Menampilkan detail paket tertentu untuk vendor tertentu (opsional, jika dipakai).
     */
    public function showPackageDetail($vendorId, $packageId)
    {
        try {
            $vendor = Vendor::query()
                ->where('isApproved', 'APPROVED')
                ->findOrFail($vendorId);

            $package = $vendor->packages()->find($packageId);

            if (!$package) {
                return response()->json(['message' => 'Package not found'], 404);
            }

            return response()->json([
                'message' => 'Detail Paket berhasil diambil',
                'data' => $package,
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Error fetching package details:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['message' => 'Internal server error. Gagal memuat detail paket.'], 500);
        }
    }
}

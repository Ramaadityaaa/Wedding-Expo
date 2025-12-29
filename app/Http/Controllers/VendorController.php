<?php

namespace App\Http\Controllers;

use App\Models\WeddingOrganizer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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

            // Batasi nilai sort agar tidak aneh-aneh
            if (!in_array($sort, ['rating', 'newest', 'name'], true)) {
                $sort = 'rating';
            }

            $query = WeddingOrganizer::query()
                ->where('isApproved', 'APPROVED')

                // Konsisten: hanya hitung review yang sudah APPROVED (karena di show() juga begitu)
                ->withAvg([
                    'reviews as reviews_avg_rating' => function ($q) {
                        $q->where('status_verifikasi', 'APPROVED');
                    }
                ], 'rating')
                ->withCount([
                    'reviews as reviews_count' => function ($q) {
                        $q->where('status_verifikasi', 'APPROVED');
                    }
                ])

                // Kurangi N+1 query untuk coverPhoto (ambil portfolios sekali via eager load)
                ->with(['portfolios' => function ($q) {
                    // Ambil yang terbaru di urutan pertama
                    $q->latest();
                }]);

            if ($q !== '') {
                $query->where(function ($w) use ($q) {
                    $w->where('name', 'like', '%' . $q . '%')
                      ->orWhere('city', 'like', '%' . $q . '%');
                });
            }

            // Sorting yang rapi dan deterministik
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

            /** @var \Illuminate\Pagination\LengthAwarePaginator $vendorsPaginator */
            $vendorsPaginator = $query->paginate(12);

            // IDE sering salah infer type; ini tetap aman untuk runtime
            if (method_exists($vendorsPaginator, 'withQueryString')) {
                $vendorsPaginator->withQueryString();
            } else {
                // fallback untuk versi Laravel lama (jika ada)
                $vendorsPaginator->appends($request->except('page'));
            }

            // Transform data tanpa memicu query tambahan per item
            $vendorsPaginator->setCollection(
                $vendorsPaginator->getCollection()->map(function ($vendor) {
                    $portfolio = $vendor->relationLoaded('portfolios')
                        ? $vendor->portfolios->first()
                        : null;

                    return [
                        'id' => $vendor->id,
                        'name' => $vendor->name,
                        'city' => $vendor->city ?? 'Indonesia',
                        'description' => $vendor->description,
                        'coverPhoto' => $portfolio && !empty($portfolio->imageUrl)
                            ? asset('storage/' . $portfolio->imageUrl)
                            : null,
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
        } catch (\Exception $e) {
            Log::error('Error rendering public vendors page:', ['error' => $e->getMessage()]);
            return abort(500, 'Gagal memuat halaman vendor.');
        }
    }

    /**
     * Mengambil daftar vendor yang sudah diverifikasi (APPROVED) untuk tampilan publik (GET /api/vendors).
     */
    public function index(Request $request)
    {
        try {
            $vendors = WeddingOrganizer::query()
                ->where('isApproved', 'APPROVED')
                ->withAvg([
                    'reviews as reviews_avg_rating' => function ($q) {
                        $q->where('status_verifikasi', 'APPROVED');
                    }
                ], 'rating')
                ->withCount([
                    'reviews as reviews_count' => function ($q) {
                        $q->where('status_verifikasi', 'APPROVED');
                    }
                ])
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
                ]
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching public vendor index:', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Internal server error. Gagal memuat data.'], 500);
        }
    }

    /**
     * Menampilkan detail satu vendor (GET /api/vendors/{vendor}).
     */
    public function show(WeddingOrganizer $vendor)
    {
        try {
            if ($vendor->isApproved !== 'APPROVED') {
                return response()->json(['message' => 'Vendor tidak ditemukan atau belum diverifikasi.'], 404);
            }

            $vendor->load([
                'packages',
                'reviews' => function ($query) {
                    $query->where('status_verifikasi', 'APPROVED');
                }
            ]);

            return response()->json([
                'message' => 'Detail Vendor berhasil diambil',
                'data' => $vendor
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching public vendor details:', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Internal server error. Gagal memuat detail vendor.'], 500);
        }
    }

    /**
     * Menampilkan detail paket tertentu untuk vendor tertentu
     */
    public function showPackageDetail($vendorId, $packageId)
    {
        try {
            $vendor = WeddingOrganizer::query()
                ->where('isApproved', 'APPROVED')
                ->findOrFail($vendorId);

            // Lebih efisien daripada ambil semua packages lalu find di collection
            $package = $vendor->packages()->find($packageId);

            if (!$package) {
                return response()->json(['message' => 'Package not found'], 404);
            }

            return response()->json([
                'message' => 'Detail Paket berhasil diambil',
                'data' => $package
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching package details:', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Internal server error. Gagal memuat detail paket.'], 500);
        }
    }
}

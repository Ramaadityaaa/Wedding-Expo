<?php

namespace App\Http\Controllers;

use App\Models\WeddingOrganizer;
use App\Models\Review;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class VendorController extends Controller
{
    /**
     * Mengambil daftar vendor yang sudah diverifikasi (APPROVED) untuk tampilan publik (GET /api/vendors).
     */
    public function index(Request $request)
    {
        try {
            // Menggunakan nilai ENUM 'APPROVED' sesuai struktur DB Anda
            $vendors = WeddingOrganizer::where('isApproved', 'APPROVED')
                                        ->orderByDesc('created_at')
                                        ->paginate(10);
            
            // Format respons API
            return response()->json([
                'message' => 'Daftar Vendor berhasil diambil',
                'data' => $vendors->items(), // Mengambil item dari paginator
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
            // Pastikan vendor memiliki isApproved = 'APPROVED'
            if ($vendor->isApproved !== 'APPROVED') {
                return response()->json(['message' => 'Vendor tidak ditemukan atau belum diverifikasi.'], 404);
            }

            // Eager load relasi packages dan reviews yang juga sudah di-approve
            $vendor->load(['packages', 'reviews' => function ($query) {
                $query->where('status_verifikasi', 'APPROVED'); 
            }]);

            // Response detail vendor
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
            // Mengambil vendor beserta paket-paketnya
            $vendor = WeddingOrganizer::with('packages')->findOrFail($vendorId);
            $package = $vendor->packages->find($packageId);

            if (!$package) {
                return response()->json(['message' => 'Package not found'], 404);
            }

            // Response detail paket
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

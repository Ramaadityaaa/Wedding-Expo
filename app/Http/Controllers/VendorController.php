<?php

// 🟢 KOREKSI KRITIS: Namespace diubah ke App\Http\Controllers karena file berada di folder root
namespace App\Http\Controllers; 

use App\Models\WeddingOrganizer;
use App\Models\Review; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

// Nama class tetap VendorController
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
                // Menggunakan abort(404) atau respons 404 eksplisit
                return response()->json(['message' => 'Vendor tidak ditemukan atau belum diverifikasi.'], 404);
            }
            
            // Eager load relasi reviews yang juga sudah di-approve
            $vendor->load(['reviews' => function ($query) {
                $query->where('status_verifikasi', 'APPROVED'); 
            }]);

            return response()->json([
                'message' => 'Detail Vendor berhasil diambil',
                'data' => $vendor
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching public vendor details:', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Internal server error. Gagal memuat detail vendor.'], 500);
        }
    }
}
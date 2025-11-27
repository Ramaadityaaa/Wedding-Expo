<?php

namespace App\Http\Controllers; 

use App\Models\WeddingOrganizer;
use App\Models\Review; 
use Illuminate\Http\Request;

class VendorController extends Controller
{
    /**
     * Mengambil daftar vendor yang sudah diverifikasi (APPROVED) untuk tampilan publik (GET /api/vendors).
     */
    public function index(Request $request)
    {
        // PERBAIKAN: Gunakan kolom 'isApproved' dan cari nilai 1 (APPROVED)
        $vendors = WeddingOrganizer::where('isApproved', 1) 
                                   ->orderByDesc('created_at')
                                   ->paginate(10);
        
        return response()->json([
            'message' => 'Daftar Vendor berhasil diambil',
            'data' => $vendors
        ]);
    }

    /**
     * Menampilkan detail satu vendor (GET /api/vendors/{vendor}).
     */
    public function show(WeddingOrganizer $vendor)
    {
        // PERBAIKAN: Pastikan vendor memiliki isApproved = 1 sebelum ditampilkan publik
        if ($vendor->isApproved !== 1) {
             return response()->json(['message' => 'Vendor tidak ditemukan atau belum diverifikasi.'], 404);
        }
        
        // Eager load relasi reviews yang juga sudah di-approve
        // CATATAN: Pastikan model Review juga memiliki kolom isApproved
        $vendor->load(['reviews' => function ($query) {
            // Asumsi: Review menggunakan kolom 'isApproved' (boolean) atau 'status_verifikasi'
            // Jika Review menggunakan 'status_verifikasi', ini harus disesuaikan.
            // Sementara ini saya biarkan sesuai code Anda sebelumnya (status_verifikasi) jika itu kolomnya di Model Review.
            $query->where('status_verifikasi', 'APPROVED'); 
        }]);

        return response()->json([
            'message' => 'Detail Vendor berhasil diambil',
            'data' => $vendor
        ]);
    }
}
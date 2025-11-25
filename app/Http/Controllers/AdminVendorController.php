<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WeddingOrganizer; 
use Inertia\Inertia; // HARUS ADA untuk melayani rute web
use Illuminate\Support\Facades\Response;

/**
 * Controller ini melayani DUA fungsi:
 * 1. Web Route (Inertia::render) melalui fungsi index().
 * 2. API Route (Axios/JSON response) melalui fungsi getDashboardData() dan updateVendorStatus().
 */
class AdminVendorController extends Controller 
{
    /**
     * [WEB] Dipanggil oleh routes/web.php. Memuat halaman VendorsIndex.jsx dengan Initial Props.
     * Menggunakan Inertia::render().
     */
    public function index() 
    {
        // 1. Ambil data hitungan untuk tab dinamis
        $counts = [
            'pending' => WeddingOrganizer::where('status_verifikasi', 'PENDING')->count(),
            'approved' => WeddingOrganizer::where('status_verifikasi', 'APPROVED')->count(),
            'rejected' => WeddingOrganizer::where('status_verifikasi', 'REJECTED')->count(),
        ];
        
        // 2. Ambil data vendor PENDING untuk dimuat pertama kali (Initial Data)
        // PENTING: Menggunakan ALIAS (AS) agar nama kolom dari DB cocok dengan VendorsIndex.jsx (email, phone, pic_name).
        $pendingVendors = WeddingOrganizer::where('status_verifikasi', 'PENDING')
                            ->select(
                                'id', 
                                'name', 
                                'contact_email AS email', // FIX: Menggunakan alias
                                'contact_phone AS phone', // FIX: Menggunakan alias
                                'contact_name AS pic_name', // FIX: Menggunakan alias
                                'status_verifikasi', 
                                'created_at'
                            )
                            ->latest()
                            ->get();

        // 3. Render halaman Inertia DENGAN data awal
        return Inertia::render('Admin/Vendors/Index', [
            'vendors' => $pendingVendors,
            'counts' => $counts,
            'currentStatus' => 'pending', 
        ]);
    }

    /**
     * [API] Mengambil data vendor berdasarkan STATUS yang diminta (Dipanggil oleh Axios).
     * Endpoint: /api/admin/vendors/dashboard?status=APPROVED
     */
    public function getDashboardData(Request $request) 
    {
        // Ambil status dari query string, defaultnya 'PENDING'
        $currentStatus = $request->get('status', 'PENDING'); 

        // 1. Ambil data hitungan terbaru
        $counts = [
            'pending' => WeddingOrganizer::where('status_verifikasi', 'PENDING')->count(),
            'approved' => WeddingOrganizer::where('status_verifikasi', 'APPROVED')->count(),
            'rejected' => WeddingOrganizer::where('status_verifikasi', 'REJECTED')->count(),
        ];
        
        // 2. Ambil data vendor berdasarkan status yang diminta
        $vendors = WeddingOrganizer::where('status_verifikasi', $currentStatus)
                            ->select(
                                'id', 
                                'name', 
                                'contact_email AS email', // FIX: Menggunakan alias
                                'contact_phone AS phone', // FIX: Menggunakan alias
                                'contact_name AS pic_name', // FIX: Menggunakan alias
                                'status_verifikasi', 
                                'created_at'
                            )
                            ->latest()
                            ->get();

        // 3. Kembalikan data dalam format JSON
        return Response::json([
            'data' => $vendors,
            'counts' => $counts
        ]);
    }

    /**
     * [API] Memperbarui status verifikasi vendor (APPROVED atau REJECTED).
     */
    public function updateVendorStatus(Request $request, string $vendor_id) 
    {
        $vendor = WeddingOrganizer::find($vendor_id);
        
        if (!$vendor) {
            return Response::json(['message' => 'Vendor tidak ditemukan.'], 404);
        }

        $status = $request->input('status');

        if (!in_array($status, ['APPROVED', 'REJECTED'])) {
            return Response::json(['message' => 'Status tidak valid.'], 400);
        }
        
        $vendor->status_verifikasi = $status;
        $vendor->save();

        return Response::json(['message' => "Status vendor berhasil diubah menjadi {$status}."]);
    }
}
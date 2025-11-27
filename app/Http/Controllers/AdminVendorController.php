<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WeddingOrganizer; // PASTIKAN NAMA MODEL INI BENAR dan sudah diimport
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Log; // Import Log
use Illuminate\Support\Facades\Storage; // Tambahkan Storage untuk URL file
use Inertia\Inertia; // Tambahkan Inertia
use Illuminate\Validation\Rule;

class AdminVendorController extends Controller 
{
    // --- WEB ROUTES (Inertia) ---
    /**
     * Menampilkan halaman index vendor admin (untuk Inertia).
     */
    public function index() 
    {
        try {
            // ASUMSI: Kolom verifikasi bernama 'type'
            $counts = [
                'pending' => WeddingOrganizer::where('type', 'PENDING')->count(), 
                'approved' => WeddingOrganizer::where('type', 'APPROVED')->count(),
                'rejected' => WeddingOrganizer::where('type', 'REJECTED')->count(),
            ];
            
            $pendingVendors = WeddingOrganizer::where('type', 'PENDING') 
                                             ->select('id', 'user_id', 'type', 'created_at') 
                                             ->latest()
                                             ->get();

            return Inertia::render('Admin/Vendors/Index', [
                'vendors' => $pendingVendors,
                'counts' => $counts,
                'currentStatus' => 'PENDING', 
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading Admin Vendor Index:', ['error' => $e->getMessage()]);
            return Inertia::render('Error', ['status' => 500, 'message' => 'Terjadi kesalahan saat memuat data vendor: ' . $e->getMessage()]);
        }
    }
    
    // --- API ROUTES (JSON) ---

    /**
     * [API] Mengambil semua data vendor berdasarkan STATUS.
     * Endpoint: GET /api/admin/vendors/data?status={STATUS}
     * MENGGANTIKAN getDashboardData()
     */
    public function data(Request $request) 
    {
        $currentStatus = $request->get('status', 'PENDING'); 
        
        try {
            // 1. Ambil data hitungan terbaru untuk semua tab
            $counts = [
                'pending' => WeddingOrganizer::where('type', 'PENDING')->count(),
                'approved' => WeddingOrganizer::where('type', 'APPROVED')->count(),
                'rejected' => WeddingOrganizer::where('type', 'REJECTED')->count(),
            ];
            
            // 2. Ambil data vendor berdasarkan status yang diminta
            $vendors = WeddingOrganizer::where('type', $currentStatus)
                                             ->select('id', 'user_id', 'type', 'created_at') 
                                             ->latest()
                                             ->get();

            // Kembalikan data dalam format JSON
            return Response::json([
                'data' => $vendors,
                'counts' => $counts
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching Admin Vendor Dashboard Data:', ['error' => $e->getMessage(), 'request_status' => $currentStatus]);
            return Response::json([
                'message' => 'Gagal mengambil data vendor: ' . $e->getMessage(),
                'detail' => $e->getLine() 
            ], 500); 
        }
    }

    /**
     * [API] Ambil detail satu vendor berdasarkan ID.
     * Endpoint: GET /api/admin/vendors/{vendor_id}
     *
     * @param string $vendor_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(string $vendor_id)
    {
        try {
            // Menggunakan WeddingOrganizer karena ini adalah model di draf Anda
            // Gunakan findOrFail jika Anda ingin Laravel otomatis mengeluarkan 404 jika tidak ditemukan
            $vendor = WeddingOrganizer::find($vendor_id);
            
            if (!$vendor) {
                return Response::json([
                    'message' => 'Vendor tidak ditemukan.'
                ], 404);
            }

            // --- Logika untuk Surat Izin Usaha ---
            $suratIzinUrl = null;
            // ASUMSI: Kolom di DB untuk path file adalah 'surat_izin_usaha_path'
            if (!empty($vendor->surat_izin_usaha_path)) {
                // Generate URL yang bisa diakses publik (pastikan storage:link sudah jalan)
                // Pastikan 'surat_izin_usaha_path' hanya berisi path di storage, misalnya 'public/dokumen/file.pdf'
                $suratIzinUrl = asset(Storage::url($vendor->surat_izin_usaha_path));
            }

            // --- Format Data yang Dikembalikan ---
            $data = $vendor->toArray();
            
            // Tambahkan URL Surat Izin Usaha untuk frontend
            $data['surat_izin_usaha_url'] = $suratIzinUrl;

            // Tambahkan NIB dan Alamat Usaha (gunakan nilai default jika null/kosong)
            // ASUMSI: Kolom DB bernama 'nib' dan 'alamat_usaha'
            $data['nib'] = $vendor->nib ?? 'Tidak Ada Data'; 
            $data['alamat_usaha'] = $vendor->alamat_usaha ?? 'Tidak Ada Data';
            
            // Tambahkan data kontak
            // ASUMSI: Kolom DB bernama 'contact_email' dan 'contact_phone'
            $data['contact_email'] = $vendor->contact_email ?? 'Tidak Ada Data';
            $data['contact_phone'] = $vendor->contact_phone ?? 'Tidak Ada Data';

            return Response::json([
                'status' => 'success',
                'data' => $data
            ]);

        } catch (\Exception $e) {
            // Log::error untuk mencatat error di log Laravel
            Log::error('Error fetching vendor detail ID ' . $vendor_id . ': ' . $e->getMessage()); 
            
            return Response::json([
                'message' => 'Gagal mengambil detail vendor. Cek log server.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * [API] Memperbarui status verifikasi vendor.
     * Endpoint: PATCH /api/admin/vendors/{vendor_id}/status
     */
    public function updateStatus(Request $request, string $vendor_id) 
    {
        $request->validate([
            // Sesuaikan rule dengan kolom 'type' yang Anda gunakan
            'status' => ['required', 'string', Rule::in(['APPROVED', 'REJECTED', 'PENDING'])], 
        ]);

        try {
            // Menggunakan find() karena find() menerima string ID
            $vendor = WeddingOrganizer::find($vendor_id);
            
            if (!$vendor) {
                return Response::json(['message' => 'Vendor tidak ditemukan.'], 404);
            }

            $status = $request->input('status');
            
            $vendor->type = $status; // Menggunakan kolom 'type'
            $vendor->save();

            return Response::json(['message' => "Status vendor berhasil diubah menjadi {$status}."]);

        } catch (\Exception $e) {
            Log::error('Error updating Vendor Status:', ['error' => $e->getMessage(), 'id' => $vendor_id]);
            return Response::json(['message' => 'Gagal memperbarui status: Internal Server Error.'], 500);
        }
    }

    /**
     * [API] Menghapus vendor secara permanen.
     * Endpoint: DELETE /api/admin/vendors/{vendor_id}
     */
    public function destroy(string $vendor_id)
    {
        try {
            $vendor = WeddingOrganizer::find($vendor_id);

            if (!$vendor) {
                return Response::json(['message' => 'Vendor tidak ditemukan.'], 404);
            }

            $vendor->delete();

            return Response::json(['message' => 'Vendor berhasil dihapus secara permanen.']);

        } catch (\Exception $e) {
            Log::error('Error deleting Vendor:', ['error' => $e->getMessage(), 'id' => $vendor_id]);
            return Response::json(['message' => 'Gagal menghapus vendor: Internal Server Error.'], 500);
        }
    }
}
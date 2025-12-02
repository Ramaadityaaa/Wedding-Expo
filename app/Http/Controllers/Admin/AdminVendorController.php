<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WeddingOrganizer; 
use Illuminate\Support\Facades\Log; 
use Inertia\Inertia; 
use Illuminate\Support\Facades\Response; 
use Illuminate\Support\Facades\Storage; // Digunakan di method show
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator; // Tambahkan untuk validasi eksplisit

class AdminVendorController extends Controller 
{
    /**
     * Menghitung total vendor dan menampilkan halaman indeks verifikasi vendor (default PENDING).
     */
    public function index() 
    {
        try {
            // Menghitung jumlah vendor untuk setiap status
            $counts = [
                'PENDING' => WeddingOrganizer::where('isApproved', 'PENDING')->count(), 
                'APPROVED' => WeddingOrganizer::where('isApproved', 'APPROVED')->count(),
                'REJECTED' => WeddingOrganizer::where('isApproved', 'REJECTED')->count(),
            ];
            
            // Mengambil daftar vendor PENDING untuk tampilan awal
            $pendingVendors = WeddingOrganizer::where('isApproved', 'PENDING')
                                             ->select('id', 'user_id', 'isApproved', 'created_at', 'name')
                                             ->latest()
                                             ->get();

            return Inertia::render('Admin/Vendors/Index', [
                'vendors' => $pendingVendors,
                'counts' => $counts,
                'currentStatus' => 'PENDING',
            ]);
        } catch (\Exception $e) {
            Log::error("Error loading Admin Vendor Index:", ['error' => $e->getMessage()]);
            // Mengembalikan ke halaman admin dashboard jika terjadi error fatal
            return redirect()->route('admin.dashboard')->with('error', 'Gagal memuat data vendor.');
        }
    }

    /**
     * Mengambil data vendor berdasarkan status (dipanggil via AJAX/API dari frontend).
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function data(Request $request) 
    {
        $currentStatus = $request->get('status', 'PENDING'); 
        
        // Pengecekan keamanan: pastikan status yang diminta valid
        $validStatuses = ['PENDING', 'APPROVED', 'REJECTED'];
        if (!in_array(strtoupper($currentStatus), $validStatuses)) {
            return Response::json(['message' => 'Status yang diminta tidak valid.'], 400);
        }

        try {
            // Menghitung ulang jumlah vendor untuk memastikan tampilan tab/badge benar
            $counts = [
                'PENDING' => WeddingOrganizer::where('isApproved', 'PENDING')->count(),
                'APPROVED' => WeddingOrganizer::where('isApproved', 'APPROVED')->count(),
                'REJECTED' => WeddingOrganizer::where('isApproved', 'REJECTED')->count(),
            ];

            // Mengambil vendor berdasarkan status dan melakukan pagination
            $vendors = WeddingOrganizer::where('isApproved', strtoupper($currentStatus))
                                       ->select('id', 'user_id', 'isApproved', 'created_at', 'name')
                                       ->latest()
                                       ->paginate(10); // Gunakan paginate untuk data yang lebih besar
            
            // Mengembalikan data JSON yang terstruktur (dan dijamin Array/Collection oleh paginate)
            return Response::json([
                'vendors' => $vendors->items(),
                'counts' => $counts,
                'pagination' => [
                    'total' => $vendors->total(),
                    'current_page' => $vendors->currentPage(),
                    'per_page' => $vendors->perPage(),
                    'last_page' => $vendors->lastPage(),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error("Error fetching vendor data for status {$currentStatus}:", ['error' => $e->getMessage()]);
            
            // Mengembalikan error 500 yang jelas
            return Response::json([
                'message' => 'Internal server error. Gagal memuat data vendor.',
                'error_detail' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Mengubah status verifikasi vendor (APPROVED/REJECTED).
     */
    public function updateStatus(Request $request, string $vendor_id) 
    {
        // Validasi input
        $validator = Validator::make($request->all(), [
            'status' => ['required', Rule::in(['APPROVED', 'REJECTED'])],
        ]);

        if ($validator->fails()) {
            return Response::json(['message' => 'Status yang dikirim tidak valid.'], 400);
        }

        $vendor = WeddingOrganizer::find($vendor_id);
        
        if (!$vendor) {
            return Response::json(['message' => 'Vendor tidak ditemukan.'], 404);
        }

        try {
            $status = $request->input('status');
            
            // Update kolom 'isApproved'
            $vendor->isApproved = $status; 
            $vendor->save();

            return Response::json(['message' => "Status vendor '{$vendor->name}' berhasil diubah menjadi {$status}."]);
        } catch (\Exception $e) {
            Log::error("Error updating vendor status for ID {$vendor_id}:", ['error' => $e->getMessage()]);
            return Response::json(['message' => 'Gagal memperbarui status vendor.'], 500);
        }
    }

    /**
     * Menampilkan detail lengkap vendor dan dokumen.
     */
    public function show(WeddingOrganizer $vendor)
    {
        // Asumsi relasi 'user' ada dan dibutuhkan
        $vendor->load('user'); 

        // Untuk menampilkan path dokumen/foto, pastikan kolomnya ada di model/tabel
        // Contoh: Mengubah path storage menjadi URL publik
        if ($vendor->logo) {
             $vendor->logo_url = Storage::url($vendor->logo);
        }
        if ($vendor->coverPhoto) {
             $vendor->cover_photo_url = Storage::url($vendor->coverPhoto);
        }
        if ($vendor->permit_image_path) {
             $vendor->permit_image_url = Storage::url($vendor->permit_image_path);
        }
        
        return Inertia::render('Admin/Vendors/Show', [
            'vendor' => $vendor,
        ]);
    }
    
    /**
     * Menghapus vendor (opsional).
     */
    public function destroy(WeddingOrganizer $vendor)
    {
        try {
            $vendorName = $vendor->name;
            $vendor->delete();
            
            // Redirect setelah penghapusan
            return redirect()->route('admin.vendors.index')->with('success', "Vendor '{$vendorName}' berhasil dihapus.");
        } catch (\Exception $e) {
            Log::error("Error deleting vendor:", ['error' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Gagal menghapus vendor. Pastikan tidak ada data terkait.');
        }
    }
}
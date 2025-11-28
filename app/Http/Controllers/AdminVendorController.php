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
    // Menampilkan halaman index vendor admin
    public function index() 
    {
        try {
            $counts = [
                'pending' => WeddingOrganizer::where('type', 'PENDING')->count(), 
                'approved' => WeddingOrganizer::where('type', 'APPROVED')->count(),
                'rejected' => WeddingOrganizer::where('type', 'REJECTED')->count(),
            ];
            
            $pendingVendors = WeddingOrganizer::where('type', 'PENDING')
                                             ->select('id', 'user_id', 'type', 'created_at', 'company_name')
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

    // API untuk mengambil semua data vendor berdasarkan status
    public function data(Request $request) 
    {
        $currentStatus = $request->get('status', 'PENDING'); 
        
        try {
            $counts = [
                'pending' => WeddingOrganizer::where('type', 'PENDING')->count(),
                'approved' => WeddingOrganizer::where('type', 'APPROVED')->count(),
                'rejected' => WeddingOrganizer::where('type', 'REJECTED')->count(),
            ];

            $vendors = WeddingOrganizer::where('type', $currentStatus)
                                        ->select('id', 'user_id', 'type', 'created_at', 'company_name')
                                        ->latest()
                                        ->get();

            return Response::json([
                'data' => $vendors,
                'counts' => $counts
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching Admin Vendor Dashboard Data:', ['error' => $e->getMessage()]);
            return Response::json([
                'message' => 'Gagal mengambil data vendor: ' . $e->getMessage(),
                'detail' => $e->getLine() 
            ], 500); 
        }
    }

    // API untuk mengambil detail vendor berdasarkan ID
    public function show(string $vendor_id)
    {
        try {
            $vendor = WeddingOrganizer::find($vendor_id);
            
            if (!$vendor) {
                return Response::json([
                    'message' => 'Vendor tidak ditemukan.'
                ], 404);
            }

            $suratIzinUrl = null;
            if (!empty($vendor->surat_izin_usaha_path)) {
                $suratIzinUrl = asset(Storage::url($vendor->surat_izin_usaha_path));
            }

            $data = $vendor->toArray();
            $data['surat_izin_usaha_url'] = $suratIzinUrl;
            $data['nib'] = $vendor->nib ?? 'Tidak Ada Data';
            $data['alamat_usaha'] = $vendor->alamat_usaha ?? 'Tidak Ada Data';
            $data['contact_email'] = $vendor->contact_email ?? 'Tidak Ada Data';
            $data['contact_phone'] = $vendor->contact_phone ?? 'Tidak Ada Data';

            return Response::json([
                'status' => 'success',
                'data' => $data
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching vendor detail ID ' . $vendor_id . ': ' . $e->getMessage());
            return Response::json([
                'message' => 'Gagal mengambil detail vendor. Cek log server.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // API untuk memperbarui status vendor
    public function updateStatus(Request $request, string $vendor_id) 
    {
        $request->validate([
            'status' => ['required', 'string', Rule::in(['APPROVED', 'REJECTED', 'PENDING'])],
        ]);

        try {
            $vendor = WeddingOrganizer::find($vendor_id);
            
            if (!$vendor) {
                return Response::json(['message' => 'Vendor tidak ditemukan.'], 404);
            }

            $status = $request->input('status');
            $vendor->type = $status;
            $vendor->save();

            return Response::json(['message' => "Status vendor berhasil diubah menjadi {$status}."]);
        } catch (\Exception $e) {
            Log::error('Error updating Vendor Status:', ['error' => $e->getMessage()]);
            return Response::json(['message' => 'Gagal memperbarui status: Internal Server Error.'], 500);
        }
    }

    // API untuk menghapus vendor
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
            Log::error('Error deleting Vendor:', ['error' => $e->getMessage()]);
            return Response::json(['message' => 'Gagal menghapus vendor: Internal Server Error.'], 500);
        }
    }
}

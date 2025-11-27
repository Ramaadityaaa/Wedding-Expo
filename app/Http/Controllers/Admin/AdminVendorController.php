<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WeddingOrganizer;
use Illuminate\Support\Facades\DB;

class AdminVendorController extends Controller
{
    /**
     * Helper function to get vendor status counts.
     * Menggunakan String status di kolom 'isApproved'.
     */
    private function getVendorStatusCounts()
    {
        // Menghitung status berdasarkan nilai String di kolom 'isApproved'
        $approvedCount = WeddingOrganizer::where('isApproved', 'APPROVED')->count();
        $pendingCount = WeddingOrganizer::where('isApproved', 'PENDING')->count(); 
        $rejectedCount = WeddingOrganizer::where('isApproved', 'REJECTED')->count();

        return [
            'TOTAL' => WeddingOrganizer::count(),
            'PENDING' => $pendingCount, 
            'APPROVED' => $approvedCount,
            // Sekarang menghitung REJECTED dari DB
            'REJECTED' => $rejectedCount, 
        ];
    }

    /**
     * Tampilkan halaman utama Vendor Management (Inertia Page).
     */
    public function index()
    {
        $statusCounts = $this->getVendorStatusCounts();
        return inertia('Admin/pages/VendorManagement', [
            'initialStatusCounts' => $statusCounts,
        ]);
    }

    /**
     * [API] Ambil data vendor berdasarkan status (untuk tabel di frontend).
     * Rute: /api/admin/vendors/data (GET)
     */
    public function data(Request $request)
    {
        $request->validate([
            'status' => 'nullable|string|in:PENDING,APPROVED,REJECTED', 
        ]);

        $statusFilter = $request->input('status', 'PENDING'); // Default ke PENDING

        // Query dasar
        $query = WeddingOrganizer::query();

        // Terapkan filter status menggunakan nilai String di 'isApproved'
        $query->where('isApproved', $statusFilter);
        // Catatan: Jika Anda ingin menampilkan REJECTED, 
        // pastikan ada data dengan 'isApproved' = 'REJECTED' di DB

        // Ambil data, urutkan dari yang terbaru (dibuat)
        $vendors = $query->latest()->get([
            'id',
            'name',
            'created_at',
            'isApproved', // Diperlukan untuk mapping
            'contact_email',
            'contact_phone',
        ]);
        
        // Return sebagai JSON (API Response)
        return response()->json([
            'data' => $vendors->map(function ($vendor) {
                // Mapping status_verifikasi langsung dari nilai String di DB
                $vendor->status_verifikasi = $vendor->isApproved; 
                unset($vendor->isApproved); 
                return $vendor;
            })->values(),
        ]);
    }

    /**
     * [API] Perbarui status verifikasi Vendor.
     * Rute: PATCH /api/admin/vendors/{vendor_id}/status
     */
    public function updateStatus(Request $request, $vendorId)
    {
        $request->validate([
            'status_verifikasi' => 'required|string|in:APPROVED,REJECTED,PENDING', 
        ]);

        $vendor = WeddingOrganizer::findOrFail($vendorId);
        $newStatus = $request->status_verifikasi; // String status baru

        try {
            DB::beginTransaction();

            // Lakukan pembaruan status: Langsung simpan string status baru
            $vendor->isApproved = $newStatus;
            $vendor->save();

            DB::commit();

            return response()->json([
                'message' => "Status vendor {$vendor->name} berhasil diubah menjadi {$newStatus}.",
                'vendor' => $vendor,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error("Gagal memperbarui status vendor ID: {$vendorId}. Error: " . $e->getMessage());

            return response()->json([
                'message' => 'Gagal memperbarui status vendor. Kesalahan database.',
                'error' => $e->getMessage(), 
            ], 500);
        }
    }

    /**
     * [API] Hapus Vendor secara permanen.
     * Rute: DELETE /api/admin/vendors/{vendor_id}
     */
    public function destroy($vendorId)
    {
        $vendor = WeddingOrganizer::findOrFail($vendorId);
        $vendorName = $vendor->name;

        try {
            DB::beginTransaction();
            $vendor->delete();
            DB::commit();

            return response()->json([
                'message' => "Vendor '{$vendorName}' dan semua datanya berhasil dihapus permanen.",
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error("Gagal menghapus vendor ID: {$vendorId}. Error: " . $e->getMessage());

            return response()->json([
                'message' => 'Gagal menghapus vendor. Kesalahan database.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Vendor; // <--- GANTI: Pakai Vendor, Jangan WeddingOrganizer
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class AdminVendorController extends Controller
{
    /**
     * Halaman manajemen vendor (Admin).
     */
    public function index()
    {
        // Gunakan Model Vendor
        $vendors = Vendor::select(
            'id',
            'user_id',
            'isApproved',
            'created_at',

            // Data Tampilan
            'name',
            'contact_email as email', // Pastikan kolom ini ada di tabel vendors
            'phone',                  // Di tabel vendors namanya 'phone', bukan 'contact_phone'
            'address',
            'city',

            // Permit / Izin Usaha
            'permit_number',
            'permit_image_path'
        )
            ->with('user') // Eager load user agar bisa ambil nama PIC jika perlu
            ->latest()
            ->get()
            ->map(function ($v) {
                // Generate URL publik
                $v->permit_image_url = $v->permit_image_path
                    ? asset('storage/' . ltrim($v->permit_image_path, '/'))
                    : null;

                return $v;
            });

        return Inertia::render('Admin/pages/VendorManagement', [
            'vendors' => $vendors,
        ]);
    }

    /**
     * Mengubah status verifikasi vendor (APPROVED/REJECTED/PENDING).
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => ['required', Rule::in(['APPROVED', 'REJECTED', 'PENDING'])],
        ]);

        // Gunakan Model Vendor
        $vendor = Vendor::findOrFail($id);

        $vendor->update([
            'isApproved' => $request->status,
            // Jika status APPROVED, pastikan status aktif juga
            'status'     => $request->status === 'APPROVED' ? 'Active' : $vendor->status,
        ]);

        return redirect()->back()->with(
            'success',
            "Status vendor '{$vendor->name}' berhasil diubah menjadi {$request->status}."
        );
    }

    /**
     * Menghapus vendor.
     */
    public function destroy($id)
    {
        // Gunakan Model Vendor
        $vendor = Vendor::findOrFail($id);

        // Hapus file permit jika ada (bersih-bersih file)
        if ($vendor->permit_image_path && Storage::disk('public')->exists($vendor->permit_image_path)) {
            Storage::disk('public')->delete($vendor->permit_image_path);
        }

        $vendor->delete();

        return redirect()->back()->with('success', 'Vendor berhasil dihapus.');
    }

    /**
     * Detail vendor.
     */
    public function show($id)
    {
        // Gunakan Model Vendor
        $vendor = Vendor::with('user')->findOrFail($id);

        $vendor->permit_image_url = $vendor->permit_image_path
            ? asset('storage/' . ltrim($vendor->permit_image_path, '/'))
            : null;

        return Inertia::render('Admin/pages/VendorDetail', [
            'vendor' => $vendor,
        ]);
    }
}

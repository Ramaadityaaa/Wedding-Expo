<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WeddingOrganizer;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class AdminVendorController extends Controller
{
    /**
     * Halaman manajemen vendor (Admin).
     * Mengirim data vendor + URL publik untuk permit_image_path ke React.
     */
    public function index()
    {
        $vendors = WeddingOrganizer::select(
            'id',
            'user_id',
            'isApproved',
            'created_at',

            // data tampilan
            'name',
            'contact_email as email',
            'contact_phone as phone',
            'address',
            'city',

            // permit
            'permit_number',
            'permit_image_path'
        )
            ->latest()
            ->get()
            ->map(function ($v) {
                // Kirim URL publik ke React (tanpa Storage::url untuk menghindari warning editor)
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

        $vendor = WeddingOrganizer::findOrFail($id);

        $vendor->update([
            'isApproved' => $request->status,
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
        $vendor = WeddingOrganizer::findOrFail($id);
        $vendor->delete();

        return redirect()->back()->with('success', 'Vendor berhasil dihapus.');
    }

    /**
     * Detail vendor (jika halaman terpisah digunakan).
     */
    public function show($id)
    {
        $vendor = WeddingOrganizer::with('user')->findOrFail($id);

        // Tambahkan URL gambar untuk permit
        $vendor->permit_image_url = $vendor->permit_image_path
            ? asset('storage/' . ltrim($vendor->permit_image_path, '/'))
            : null;

        return Inertia::render('Admin/pages/VendorDetail', [
            'vendor' => $vendor,
        ]);
    }
}

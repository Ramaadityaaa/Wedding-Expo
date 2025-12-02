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
     * Menampilkan halaman manajemen vendor.
     * Mengirim SEMUA data vendor dari DATABASE ke Frontend React.
     */
    public function index()
    {
        // Ambil data asli dari database, urutkan dari yang terbaru
        // Pastikan kolom-kolom ini ada di tabel 'wedding_organizers' Anda
        $vendors = WeddingOrganizer::select(
            'id',
            'user_id',
            'isApproved',
            'created_at',
            'name',
            'contact_email as email', // Alias agar sesuai dengan frontend yang minta 'email'
            'contact_phone as phone', // Alias agar sesuai dengan frontend yang minta 'phone'
            'address',
            'city'
        )
            ->latest()
            ->get();

        // Debugging: Cek apakah data ada
        // dd($vendors); 

        // Render React Page dengan membawa data 'vendors'
        return Inertia::render('Admin/pages/VendorManagement', [
            'vendors' => $vendors
        ]);
    }

    /**
     * Mengubah status verifikasi vendor (APPROVED/REJECTED).
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => ['required', Rule::in(['APPROVED', 'REJECTED', 'PENDING'])],
        ]);

        $vendor = WeddingOrganizer::findOrFail($id);

        $vendor->update([
            'isApproved' => $request->status
        ]);

        return redirect()->back()->with('success', "Status vendor '{$vendor->name}' berhasil diubah menjadi {$request->status}.");
    }

    /**
     * Menghapus vendor.
     */
    public function destroy($id)
    {
        $vendor = WeddingOrganizer::findOrFail($id);
        $vendor->delete();

        return redirect()->back()->with('success', "Vendor berhasil dihapus.");
    }

    /**
     * Menampilkan detail vendor (Jika diperlukan halaman terpisah)
     */
    public function show($id)
    {
        $vendor = WeddingOrganizer::with('user')->findOrFail($id);
        return Inertia::render('Admin/pages/VendorDetail', [
            'vendor' => $vendor
        ]);
    }
}

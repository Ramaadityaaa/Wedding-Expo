<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Vendor; // <--- WAJIB GANTI KE MODEL VENDOR
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Inertia\Response;

class RoleController extends Controller
{
    /**
     * Menampilkan daftar vendor yang disetujui untuk diedit role-nya.
     */
    public function index(): Response
    {
        // Gunakan Model Vendor
        $vendors = Vendor::where('isApproved', 'APPROVED')
            ->select(
                'id',
                'name',
                'contact_email as email', // Alias agar sesuai frontend
                'phone',                  // Di tabel vendors namanya 'phone'
                'role'
            )
            ->latest()
            ->get();

        return Inertia::render('Admin/pages/RoleEditor', [
            'vendors' => $vendors
        ]);
    }

    /**
     * Menyimpan perubahan role secara massal (Batch Update).
     */
    public function update(Request $request)
    {
        $request->validate([
            'edits' => 'required|array',
        ]);

        $edits = $request->input('edits');

        DB::beginTransaction();
        try {
            foreach ($edits as $vendorId => $newRole) {
                if (in_array($newRole, ['Vendor', 'Membership'])) {
                    // Update menggunakan Model Vendor
                    Vendor::where('id', $vendorId)->update(['role' => $newRole]);
                }
            }

            DB::commit();
            return redirect()->back()->with('success', 'Perubahan role membership berhasil disimpan.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal menyimpan perubahan: ' . $e->getMessage());
        }
    }
}

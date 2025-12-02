<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WeddingOrganizer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class RoleController extends Controller
{
    /**
     * Menampilkan daftar vendor yang disetujui untuk diedit role-nya.
     */
    public function index()
    {
        // Hanya ambil yang sudah Approved
        $vendors = WeddingOrganizer::where('isApproved', 'APPROVED')
            ->select('id', 'name', 'contact_email as email', 'contact_phone as phone', 'role')
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
            'edits' => 'required|array', // Format: [ id_vendor => 'RoleBaru', ... ]
        ]);

        $edits = $request->input('edits');

        DB::beginTransaction();
        try {
            foreach ($edits as $vendorId => $newRole) {
                // Pastikan role valid (Vendor / Membership)
                if (in_array($newRole, ['Vendor', 'Membership'])) {
                    WeddingOrganizer::where('id', $vendorId)->update(['role' => $newRole]);
                }
            }

            DB::commit();
            return redirect()->back()->with('success', 'Perubahan role berhasil disimpan.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal menyimpan perubahan: ' . $e->getMessage());
        }
    }
}

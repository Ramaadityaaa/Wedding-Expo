<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WeddingOrganizer; // <-- Import model Anda
use Illuminate\Http\RedirectResponse; // <-- Import RedirectResponse

class VendorController extends Controller
{
    /**
     * Menyetujui vendor.
     */
    public function approve(WeddingOrganizer $vendor): RedirectResponse
    {
        // Logika Next.js: db.weddingOrganizer.update(...)
        // Ini adalah "terjemahan" Laravel-nya:
        $vendor->update([
            'isApproved' => true
        ]);
        
        // Logika Next.js: return NextResponse.json(...)
        // Di Inertia, kita REDIRECT KEMBALI ke halaman sebelumnya
        // dengan pesan sukses (flash message).
        return redirect()->back()->with('success', 'Vendor approved successfully.');
    }
}
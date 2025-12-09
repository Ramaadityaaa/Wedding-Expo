<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class VendorPackageController extends Controller
{
    // Menampilkan daftar paket
    public function index()
    {
        $vendor = Auth::user()->vendor;

        $packages = Package::where('vendor_id', $vendor->id)
            ->latest()
            ->get();

        return Inertia::render('Vendor/pages/PackagePage', [
            'packages' => $packages
        ]);
    }

    // Simpan Paket Baru
    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'price'       => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'features'    => 'nullable|array', // Harus array
            'features.*'  => 'string',         // Isi array harus string
        ]);

        $vendor = Auth::user()->vendor;

        Package::create([
            'vendor_id'   => $vendor->id,
            'name'        => $request->name,
            'price'       => $request->price,
            'description' => $request->description,
            'features'    => $request->features,
        ]);

        return redirect()->back()->with('success', 'Paket berhasil dibuat!');
    }

    // Update Paket
    public function update(Request $request, $id)
    {
        $vendor = Auth::user()->vendor;
        $package = Package::where('vendor_id', $vendor->id)->findOrFail($id);

        $request->validate([
            'name'        => 'required|string|max:255',
            'price'       => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'features'    => 'nullable|array',
        ]);

        $package->update([
            'name'        => $request->name,
            'price'       => $request->price,
            'description' => $request->description,
            'features'    => $request->features,
        ]);

        return redirect()->back()->with('success', 'Paket berhasil diperbarui!');
    }

    // Hapus Paket
    public function destroy($id)
    {
        $vendor = Auth::user()->vendor;
        $package = Package::where('vendor_id', $vendor->id)->findOrFail($id);

        $package->delete();

        return redirect()->back()->with('success', 'Paket berhasil dihapus.');
    }
}

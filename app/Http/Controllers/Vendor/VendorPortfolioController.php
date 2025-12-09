<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Portfolio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class VendorPortfolioController extends Controller
{
    /**
     * Menampilkan halaman daftar portofolio.
     */
    public function index()
    {
        $user = Auth::user();

        // Pastikan user punya vendor (safety check)
        if (!$user->vendor) {
            return redirect()->route('vendor.dashboard')->with('error', 'Profil vendor belum ditemukan.');
        }

        $portfolios = Portfolio::where('vendor_id', $user->vendor->id)
            ->latest()
            ->get();

        return Inertia::render('Vendor/pages/PortfolioPage', [
            'portfolios' => $portfolios
        ]);
    }

    /**
     * Menyimpan portofolio baru ke database.
     */
    public function store(Request $request)
    {
        // 1. Validasi Dinamis
        // Kita cek dulu, user mau upload apa (image atau video)
        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            // Validasi Image (jika ada)
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120', // Max 5MB
            // Validasi Video (jika ada) - Max 50MB (sesuaikan php.ini nanti)
            'video'       => 'nullable|mimes:mp4,mov,avi,wmv|max:51200',
        ]);

        $vendor = Auth::user()->vendor;
        $imageUrl = null;
        $videoUrl = null;

        // 2. Cek apakah ada file Image?
        if ($request->hasFile('image')) {
            $imageUrl = $request->file('image')->store('portfolios/images', 'public');
        }

        // 3. Cek apakah ada file Video?
        if ($request->hasFile('video')) {
            $videoUrl = $request->file('video')->store('portfolios/videos', 'public');
        }

        // Pastikan salah satu terisi
        if (!$imageUrl && !$videoUrl) {
            return redirect()->back()->withErrors(['file' => 'Harap unggah minimal satu foto atau video.']);
        }

        // 4. Simpan ke Database
        Portfolio::create([
            'vendor_id'   => $vendor->id,
            'title'       => $request->title,
            'description' => $request->description,
            'imageUrl'    => $imageUrl,
            'videoUrl'    => $videoUrl, // Simpan path video jika ada
            'isPublished' => true,
        ]);

        return redirect()->back()->with('success', 'Media portofolio berhasil ditambahkan!');
    }

    /**
     * Menghapus portofolio.
     */
    public function destroy($id)
    {
        $vendor = Auth::user()->vendor;

        // Cari portfolio milik vendor ini (agar tidak bisa hapus punya orang lain)
        $portfolio = Portfolio::where('vendor_id', $vendor->id)->findOrFail($id);

        // 1. Hapus File Fisik
        if ($portfolio->imageUrl && Storage::disk('public')->exists($portfolio->imageUrl)) {
            Storage::disk('public')->delete($portfolio->imageUrl);
        }

        // 2. Hapus Data Database
        $portfolio->delete();

        return redirect()->back()->with('success', 'Portofolio berhasil dihapus.');
    }
}

<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Package;
use App\Models\PackageImage;
use App\Models\Portfolio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class VendorPortfolioController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if (!$user->vendor) {
            return redirect()->route('vendor.dashboard')
                ->with('error', 'Profil vendor belum ditemukan.');
        }

        $vendorId = $user->vendor->id;

        $portfolios = Portfolio::where('vendor_id', $vendorId)->latest()->get();
        $packages   = Package::where('vendor_id', $vendorId)->latest()->get(['id', 'name', 'price']);

        return Inertia::render('Vendor/pages/PortfolioPage', [
            'portfolios' => $portfolios,
            'packages'   => $packages,
        ]);
    }

    public function store(Request $request)
    {
        $vendor = Auth::user()->vendor;

        // normalize package_id ("" / "0" -> null)
        $rawPackageId = $request->input('package_id');
        $packageId = (is_null($rawPackageId) || $rawPackageId === '' || $rawPackageId === '0')
            ? null
            : (int) $rawPackageId;

        $request->merge(['package_id' => $packageId]);

        $validated = $request->validate([
            'package_id' => [
                'nullable',
                'integer',
                'min:1',
                Rule::exists('packages', 'id')->where(fn ($q) => $q->where('vendor_id', $vendor->id)),
            ],
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image'       => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
            'video'       => ['nullable', 'mimes:mp4,mov,avi,wmv', 'max:51200'],
        ]);

        $imagePath = $request->hasFile('image')
            ? $request->file('image')->store('portfolios/images', 'public')
            : null;

        $videoPath = $request->hasFile('video')
            ? $request->file('video')->store('portfolios/videos', 'public')
            : null;

        if (!$imagePath && !$videoPath) {
            return redirect()->back()->withErrors(['file' => 'Harap unggah minimal satu foto atau video.']);
        }

        DB::transaction(function () use ($vendor, $validated, $imagePath, $videoPath) {

            // 1) Simpan portfolio dan SIMPAN OBJEK-nya (biar dapat $portfolio->id)
            $portfolio = Portfolio::create([
                'vendor_id'   => $vendor->id,
                'package_id'  => $validated['package_id'] ?? null,
                'title'       => $validated['title'],
                'description' => $validated['description'] ?? null,
                'imageUrl'    => $imagePath,
                'videoUrl'    => $videoPath,
                'isPublished' => true,
            ]);

            // 2) Kalau pilih paket & upload image -> simpan ke package_images + LINK portfolio_id
            if (!empty($validated['package_id']) && $imagePath) {
                $maxSort  = (int) PackageImage::where('package_id', $validated['package_id'])->max('sort_order');
                $nextSort = $maxSort + 1;

                PackageImage::create([
                    'package_id'   => $validated['package_id'],
                    'portfolio_id' => $portfolio->id,   // ✅ ini yang bikin delete sinkron
                    'path'         => $imagePath,
                    'sort_order'   => $nextSort,
                    'is_published' => 1,
                ]);
            }
        });

        return redirect()->back()->with('success', 'Media portofolio berhasil ditambahkan!');
    }

    public function destroy($id)
    {
        $vendor = Auth::user()->vendor;

        $portfolio = Portfolio::where('vendor_id', $vendor->id)->findOrFail($id);

        // simpan dulu path untuk hapus file setelah transaksi
        $imagePath = $portfolio->imageUrl;
        $videoPath = $portfolio->videoUrl;

        DB::transaction(function () use ($vendor, $portfolio) {

            // ✅ Cara utama: hapus berdasarkan portfolio_id
            PackageImage::where('portfolio_id', $portfolio->id)->delete();

            // ✅ Fallback (buat data lama yang portfolio_id masih NULL):
            // hapus berdasarkan path tapi dibatasi hanya package milik vendor ini
            if ($portfolio->imageUrl) {
                $vendorPackageIds = Package::where('vendor_id', $vendor->id)->pluck('id');

                PackageImage::whereNull('portfolio_id')
                    ->whereIn('package_id', $vendorPackageIds)
                    ->where('path', $portfolio->imageUrl)
                    ->delete();
            }

            $portfolio->delete();
        });

        // hapus file fisik (di luar transaction biar DB tetap aman)
        if ($imagePath && Storage::disk('public')->exists($imagePath)) {
            Storage::disk('public')->delete($imagePath);
        }
        if ($videoPath && Storage::disk('public')->exists($videoPath)) {
            Storage::disk('public')->delete($videoPath);
        }

        return redirect()->back()->with('success', 'Portofolio berhasil dihapus.');
    }
}

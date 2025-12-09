<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class VendorReviewController extends Controller
{
    public function index()
    {
        $vendor = Auth::user()->vendor;

        // Ambil review beserta data user (customer)
        $reviews = Review::with('user')
            ->where('vendor_id', $vendor->id)
            ->latest()
            ->get();

        // Hitung Statistik Sederhana untuk Dashboard Review
        $stats = [
            'total_reviews' => $reviews->count(),
            'average_rating' => $reviews->avg('rating') ?? 0,
            'stars_5' => $reviews->where('rating', 5)->count(),
            'stars_4' => $reviews->where('rating', 4)->count(),
            'stars_3' => $reviews->where('rating', 3)->count(),
            'stars_2' => $reviews->where('rating', 2)->count(),
            'stars_1' => $reviews->where('rating', 1)->count(),
        ];

        return Inertia::render('Vendor/pages/ReviewPage', [
            'reviews' => $reviews,
            'stats' => $stats
        ]);
    }

    // Fitur Balas Review
    public function reply(Request $request, $id)
    {
        $request->validate([
            'reply' => 'required|string|max:1000',
        ]);

        $vendor = Auth::user()->vendor;

        // Pastikan review ini benar-benar milik vendor yang sedang login (Security Check)
        $review = Review::where('vendor_id', $vendor->id)->findOrFail($id);

        $review->update([
            'reply' => $request->reply
        ]);

        return redirect()->back()->with('success', 'Balasan Anda berhasil dikirim.');
    }
}

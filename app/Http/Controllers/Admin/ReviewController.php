<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function index()
    {
        // Ambil review dengan relasi VENDOR + USER, urutkan terbaru
        $reviews = Review::with(['vendor', 'user'])
            ->latest()
            ->get();

        return Inertia::render('Admin/pages/ReviewModeration', [
            'reviews' => $reviews
        ]);
    }

    public function approve($id)
    {
        $review = Review::findOrFail($id);
        $review->update(['status' => Review::STATUS_APPROVED]);

        return redirect()->back()->with('success', 'Ulasan berhasil disetujui dan ditayangkan.');
    }

    public function reject($id)
    {
        $review = Review::findOrFail($id);
        $review->update(['status' => Review::STATUS_REJECTED]);

        return redirect()->back()->with('success', 'Ulasan ditolak (diarsipkan).');
    }
}

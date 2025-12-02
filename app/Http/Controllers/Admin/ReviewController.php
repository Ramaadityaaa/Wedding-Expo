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
        // Ambil review dengan relasi, urutkan dari terbaru
        $reviews = Review::with(['weddingOrganizer', 'user'])
            ->latest()
            ->get();

        return Inertia::render('Admin/pages/ReviewModeration', [
            'reviews' => $reviews
        ]);
    }

    public function approve($id)
    {
        $review = Review::findOrFail($id);
        $review->update(['status' => 'APPROVED']); // Set status APPROVED

        return redirect()->back()->with('success', 'Ulasan berhasil disetujui dan ditayangkan.');
    }

    public function reject($id)
    {
        $review = Review::findOrFail($id);
        $review->update(['status' => 'REJECTED']); // Set status REJECTED (Data tetap ada)

        return redirect()->back()->with('success', 'Ulasan ditolak (diarsipkan).');
    }
}

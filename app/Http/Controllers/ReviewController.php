<?php

namespace App\Http\Controllers; // <-- Namespace Publik

use App\Models\Review;
use App\Models\WeddingOrganizer;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Menampilkan daftar review untuk vendor tertentu (GET /api/vendors/{vendor}/reviews).
     */
    public function index(WeddingOrganizer $vendor)
    {
        $reviews = $vendor->reviews()
            ->where('isApproved', true) // Hanya tampilkan review yang sudah disetujui
            ->with('user:id,name')
            ->latest()
            ->paginate(10);

        return response()->json([
            'message' => "Reviews untuk {$vendor->name} berhasil diambil",
            'data' => $reviews
        ]);
    }

    /**
     * Menyimpan review baru (POST /api/reviews) - memerlukan auth:sanctum.
     */
    public function store(Request $request)
    {
        $request->validate([
            'wedding_organizer_id' => 'required|exists:wedding_organizers,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $review = Review::create([
            'user_id' => $request->user()->id,
            'wedding_organizer_id' => $request->wedding_organizer_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'isApproved' => false, // Default: Review perlu disetujui Admin
        ]);

        return response()->json([
            'message' => 'Review berhasil dibuat dan menunggu persetujuan Admin.',
            'data' => $review
        ], 201);
    }
}
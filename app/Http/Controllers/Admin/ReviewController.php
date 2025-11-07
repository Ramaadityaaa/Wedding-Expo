<?php

// app/Http/Controllers/Admin/ReviewController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review; // <-- Pastikan model Review di-import
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class ReviewController extends Controller
{
    /**
     * Menyetujui review.
     */
    public function approve(Review $review): RedirectResponse
    {
        $review->update(['isApproved' => true]);
        return redirect()->back()->with('success', 'Review approved successfully.');
    }

    /**
     * Menolak (menghapus) review.
     */
    public function reject(Review $review): RedirectResponse
    {
        // Anda bisa hapus review-nya, atau tandai sebagai "rejected"
        // Untuk saat ini, kita hapus saja:
        $review->delete(); 
        return redirect()->back()->with('success', 'Review rejected successfully.');
    }
}
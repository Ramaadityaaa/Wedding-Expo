<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Vendor;
use Illuminate\Http\Request;

class CustomerReviewController extends Controller
{
    public function upsert(Request $request, Vendor $vendor)
    {
        $data = $request->validate([
            'rating'  => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['required', 'string', 'min:3', 'max:1000'],
        ]);

        $userId = $request->user()->id;

        // ✅ Upsert: kalau sudah ada review, update. kalau belum, create.
        Review::updateOrCreate(
            [
                'vendor_id' => $vendor->id,
                'user_id'   => $userId,
            ],
            [
                'rating'  => (int) $data['rating'],
                'comment' => trim($data['comment']),
                // ✅ kalau kamu pakai moderasi admin:
                // setiap edit jadi pending lagi (opsional)
                'status'  => Review::STATUS_PENDING,
            ]
        );

        return back()->with('success', 'Ulasan berhasil disimpan.');
    }

    public function destroy(Request $request, Vendor $vendor)
    {
        $userId = $request->user()->id;

        Review::where('vendor_id', $vendor->id)
            ->where('user_id', $userId)
            ->delete();

        return back()->with('success', 'Ulasan berhasil dihapus.');
    }
}

<?php

namespace App\Observers;

use App\Models\Review;
use App\Notifications\Vendor\NewReviewNotification;

class ReviewObserver
{
    public function created(Review $review): void
    {
        $vendor = $review->vendor; // WeddingOrganizer (hasil perbaikan relasi)
        $vendorUser = $vendor?->user;

        if (!$vendorUser) return;

        $payload = [
            'kind' => 'review',
            'title' => 'Ulasan baru',
            'body' => 'Ada ulasan baru dengan rating: ' . $review->rating . '/5',
            'url' => route('vendor.reviews.index'),
            'meta' => [
                'review_id' => $review->id,
                'rating' => $review->rating,
                'status' => $review->status,
            ],
        ];

        $vendorUser->notify(new NewReviewNotification($payload));
    }
}

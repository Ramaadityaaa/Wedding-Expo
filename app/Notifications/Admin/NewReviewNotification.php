<?php

namespace App\Notifications\Admin;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class NewReviewNotification extends Notification
{
    use Queueable;

    public function __construct(public $review)
    {
    }

    public function via($notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable): array
    {
        return [
            'title' => 'Review baru',
            'message' => 'Ada review baru. ID: ' . ($this->review->id ?? '-'),
            'url' => route('admin.reviews.index'),
            'review_id' => $this->review->id ?? null,
        ];
    }

    public function toBroadcast($notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->toArray($notifiable));
    }
}

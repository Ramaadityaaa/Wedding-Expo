<?php

namespace App\Notifications\Vendor;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class PaymentProofUploadedNotification extends Notification
{
    use Queueable;

    public function __construct(public array $payload)
    {
    }

    public function via($notifiable)
    {
        // database untuk badge unread + broadcast untuk realtime Echo
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable)
    {
        return $this->payload;
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage($this->payload);
    }
}

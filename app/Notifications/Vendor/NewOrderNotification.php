<?php

namespace App\Notifications\Vendor;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class NewOrderNotification extends Notification
{
    use Queueable;

    public function __construct(public array $payload)
    {
    }

    public function via($notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable): array
    {
        return $this->payload;
    }

    public function toBroadcast($notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->payload);
    }
}

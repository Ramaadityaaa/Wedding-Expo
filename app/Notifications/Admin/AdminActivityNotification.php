<?php

namespace App\Notifications\Admin;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class AdminActivityNotification extends Notification
{
    use Queueable;

    public function __construct(public array $payload = [])
    {
    }

    public function via($notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable): array
    {
        return [
            'kind'  => $this->payload['kind']  ?? 'system',
            'title' => $this->payload['title'] ?? 'Aktivitas baru',
            'body'  => $this->payload['body']  ?? 'Ada aktivitas baru.',
            'url'   => $this->payload['url']   ?? null,
            'meta'  => $this->payload['meta']  ?? [],
        ];
    }

    public function toBroadcast($notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'id' => $this->id,
            'type' => static::class,
            'data' => $this->toArray($notifiable),
            'created_at' => now()->toISOString(),
        ]);
    }
}

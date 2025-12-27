<?php

namespace App\Observers;

use App\Models\Order;
use App\Notifications\Vendor\NewOrderNotification;

class OrderObserver
{
    public function created(Order $order): void
    {
        $vendor = $order->vendor; // WeddingOrganizer
        $vendorUser = $vendor?->user;

        if (!$vendorUser) return;

        $payload = [
            'kind' => 'order',
            'title' => 'Pesanan baru masuk',
            'body' => 'Ada pesanan baru untuk paket: ' . ($order->package?->name ?? 'Paket'),
            'url' => route('vendor.orders.index'),
            'meta' => [
                'order_id' => $order->id,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
            ],
        ];

        $vendorUser->notify(new NewOrderNotification($payload));
    }
}

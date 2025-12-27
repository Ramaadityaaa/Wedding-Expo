<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

// Models
use App\Models\Order;
use App\Models\Review;
use App\Models\PaymentProof;
use App\Models\Invoice;

// Observers
use App\Observers\OrderObserver;
use App\Observers\ReviewObserver;
use App\Observers\PaymentProofObserver;
use App\Observers\InvoiceObserver;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Order::observe(OrderObserver::class);
        Review::observe(ReviewObserver::class);

        // Notif admin saat vendor upload / update bukti pembayaran
        PaymentProof::observe(PaymentProofObserver::class);

        // Notif admin saat vendor pesan paket membership (biasanya Invoice dibuat)
        Invoice::observe(InvoiceObserver::class);
    }
}

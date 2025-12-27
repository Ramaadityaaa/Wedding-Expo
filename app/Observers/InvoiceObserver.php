<?php

namespace App\Observers;

use App\Models\Invoice;
use App\Services\AdminNotificationService;
use Illuminate\Support\Facades\Log;

class InvoiceObserver
{
    public function created(Invoice $invoice): void
    {
        try {
            // Target utama: kejadian “vendor pesan paket membership”
            // Umumnya ditandai dengan adanya plan_id (sesuaikan jika field kamu beda)
            $isMembershipOrder = !empty($invoice->plan_id);

            if (!$isMembershipOrder) {
                return;
            }

            $vendorName = $invoice->vendor?->name
                ?? $invoice->vendor_name
                ?? 'Vendor';

            AdminNotificationService::notifyAdmins([
                'kind'  => 'membership_order',
                'title' => 'Pesanan membership baru',
                'body'  => 'Vendor memesan paket membership: ' . $vendorName,
                'url'   => route('admin.paymentproof.index'),
                'meta'  => [
                    'invoice_id' => $invoice->id,
                    'vendor_id'  => $invoice->vendor_id ?? null,
                    'plan_id'    => $invoice->plan_id ?? null,
                    'status'     => $invoice->status ?? null,
                    'amount'     => $invoice->amount ?? null,
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error('[InvoiceObserver@created] gagal kirim notif admin: ' . $e->getMessage(), [
                'invoice_id' => $invoice->id ?? null,
            ]);
        }
    }
}

<?php

namespace App\Observers;

use App\Models\PaymentProof;
use App\Services\AdminNotificationService;
use Illuminate\Support\Facades\Log;

class PaymentProofObserver
{
    public function created(PaymentProof $proof): void
    {
        try {
            $vendorName = $proof->vendor?->name ?? 'Vendor';

            AdminNotificationService::notifyAdmins([
                'kind'  => 'payment_proof',
                'title' => 'Konfirmasi pembayaran masuk',
                'body'  => 'Ada bukti pembayaran baru dari vendor: ' . $vendorName,
                'url'   => route('admin.paymentproof.index'),
                'meta'  => [
                    'payment_proof_id' => $proof->id,
                    'vendor_id'        => $proof->vendor_id,
                    'invoice_id'       => $proof->invoice_id,
                    'amount'           => $proof->amount,
                    'status'           => $proof->status,
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error('[PaymentProofObserver@created] gagal kirim notif admin: ' . $e->getMessage(), [
                'payment_proof_id' => $proof->id ?? null,
            ]);
        }
    }

    public function updated(PaymentProof $proof): void
    {
        try {
            $fileChanged = $proof->wasChanged('file_path');
            $statusChanged = $proof->wasChanged('status');

            if (!$fileChanged && !$statusChanged) {
                return;
            }

            $vendorName = $proof->vendor?->name ?? 'Vendor';

            $title = $fileChanged
                ? 'Bukti pembayaran diperbarui'
                : 'Status bukti pembayaran berubah';

            AdminNotificationService::notifyAdmins([
                'kind'  => 'payment_proof',
                'title' => $title,
                'body'  => 'Update bukti pembayaran dari vendor: ' . $vendorName,
                'url'   => route('admin.paymentproof.index'),
                'meta'  => [
                    'payment_proof_id' => $proof->id,
                    'vendor_id'        => $proof->vendor_id,
                    'invoice_id'       => $proof->invoice_id,
                    'amount'           => $proof->amount,
                    'status'           => $proof->status,
                    'changed'          => [
                        'file_path' => $fileChanged,
                        'status'    => $statusChanged,
                    ],
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error('[PaymentProofObserver@updated] gagal kirim notif admin: ' . $e->getMessage(), [
                'payment_proof_id' => $proof->id ?? null,
            ]);
        }
    }
}

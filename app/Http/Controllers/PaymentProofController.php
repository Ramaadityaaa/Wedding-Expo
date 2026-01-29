<?php

namespace App\Http\Controllers;

use App\Models\PaymentProof;
use App\Models\Invoice;
use App\Models\Vendor;
use App\Models\PackagePlan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\Rule;

class PaymentProofController extends Controller
{
    /**
     * Menampilkan daftar semua permintaan konfirmasi pembayaran di dashboard Admin.
     */
    public function index()
    {
        $paymentRequests = PaymentProof::with(['vendor', 'invoice'])
            ->latest('id')
            ->get()
            ->map(function ($proof) {
                $planName = 'Paket Membership';

                if ($proof->invoice) {
                    if (!empty($proof->invoice->package_name)) {
                        $planName = $proof->invoice->package_name;
                    } elseif (!empty($proof->invoice->plan_id)) {
                        $planId = $proof->invoice->plan_id;

                        $plan = PackagePlan::query()
                            ->where('id', $planId)
                            ->orWhere('slug', (string) $planId)
                            ->first();

                        $planName = $plan ? $plan->name : "Paket ID: {$planId} (Terhapus)";
                    }
                }

                $proof->setAttribute('package_name', $planName);

                // pastikan frontend selalu punya id payment proof yang benar
                $proof->setAttribute('payment_proof_id', $proof->id);
                $proof->setAttribute('invoice_id', $proof->invoice_id);

                return $proof;
            });

        return Inertia::render('Admin/pages/PaymentConfirmation', [
            'paymentRequests' => $paymentRequests
        ]);
    }

    /**
     * Update status pembayaran (Approved/Rejected/Pending) dan aktivasi vendor.
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => [
                'required',
                Rule::in(['Approved', 'Rejected', 'Pending', 'APPROVED', 'REJECTED', 'PENDING']),
            ],
        ]);

        // FIX: Gunakan UPPERCASE agar konsisten dengan logika frontend dan database vendor
        $normalizedStatus = strtoupper((string) $request->status); // APPROVED / REJECTED / PENDING

        try {
            DB::beginTransaction();

            // 1) Cari payment proof dengan id.
            $payment = PaymentProof::query()->lockForUpdate()->find($id);

            if (!$payment) {
                $payment = PaymentProof::query()
                    ->lockForUpdate()
                    ->where('invoice_id', $id)
                    ->latest('id')
                    ->firstOrFail();
            }

            // 2) Update payment_proofs.status
            $payment->update(['status' => $normalizedStatus]);

            // 3) Update invoice + aktivasi vendor saat APPROVED
            if ($payment->invoice_id) {
                $invoice = Invoice::query()->lockForUpdate()->find($payment->invoice_id);

                if ($invoice) {
                    if ($normalizedStatus === 'APPROVED') {
                        $invoice->update(['status' => 'PAID']);

                        if ($payment->vendor_id) {
                            $vendor = Vendor::query()->lockForUpdate()->find($payment->vendor_id);

                            if ($vendor) {
                                $updateVendor = [];

                                if (Schema::hasColumn('vendors', 'status')) {
                                    $updateVendor['status'] = 'Active'; // Sesuaikan jika DB vendor pakai uppercase 'ACTIVE'
                                }

                                if (Schema::hasColumn('vendors', 'isApproved')) {
                                    $updateVendor['isApproved'] = 'APPROVED';
                                }

                                if (Schema::hasColumn('vendors', 'membership_status')) {
                                    $updateVendor['membership_status'] = 'ACTIVE';
                                }

                                if (Schema::hasColumn('vendors', 'plan_id') && !empty($invoice->plan_id)) {
                                    $updateVendor['plan_id'] = $invoice->plan_id;
                                }

                                if (!empty($updateVendor)) {
                                    $vendor->update($updateVendor);
                                }

                                Log::info("Payment Approved. Vendor ID {$vendor->id} diaktifkan.", [
                                    'payment_proof_id' => $payment->id,
                                    'invoice_id' => $payment->invoice_id,
                                    'vendor_id' => $payment->vendor_id,
                                ]);
                            }
                        }
                    }

                    if ($normalizedStatus === 'REJECTED') {
                        $invoice->update(['status' => 'REJECTED']);
                    }

                    if ($normalizedStatus === 'PENDING') {
                        $invoice->update(['status' => 'PENDING']);
                    }
                }
            }

            DB::commit();

            $message = match ($normalizedStatus) {
                'APPROVED' => 'Pembayaran disetujui. Sistem mengaktifkan paket vendor.',
                'REJECTED' => 'Pembayaran ditolak.',
                default => 'Status pembayaran diubah ke Pending.',
            };

            if ($request->expectsJson()) {
                return response()->json([
                    'ok' => true,
                    'message' => $message,
                    'status' => $normalizedStatus,
                    'payment_proof_id' => $payment->id,
                ]);
            }

            return redirect()->back()->with('success', $message);
        } catch (\Throwable $e) {
            DB::rollBack();

            Log::error("Error PaymentProofController@updateStatus: {$e->getMessage()}", [
                'id_param' => $id,
                'status' => $request->status ?? null,
            ]);

            if ($request->expectsJson()) {
                return response()->json([
                    'ok' => false,
                    'message' => 'Gagal memperbarui status.',
                    'error' => $e->getMessage(),
                ], 500);
            }

            return redirect()->back()->with('error', 'Gagal memperbarui status: ' . $e->getMessage());
        }
    }

    /**
     * Menghapus data bukti pembayaran beserta filenya dari storage.
     */
    public function destroy($id)
    {
        try {
            $payment = PaymentProof::findOrFail($id);

            if ($payment->file_path && Storage::disk('public')->exists($payment->file_path)) {
                Storage::disk('public')->delete($payment->file_path);
            }

            $payment->delete();

            return redirect()->back()->with('success', 'Data bukti pembayaran berhasil dihapus.');
        } catch (\Throwable $e) {
            Log::error("Error PaymentProofController@destroy: {$e->getMessage()}");
            return redirect()->back()->with('error', 'Gagal menghapus data: ' . $e->getMessage());
        }
    }
}

<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\PackagePlan;
use App\Models\PaymentProof;
use App\Models\PaymentSetting;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class VendorPaymentFlowController extends Controller
{
    /**
     * 1. Halaman Checkout (Ringkasan Invoice & Instruksi Bayar)
     */
    public function create(Request $request, $invoiceId): Response
    {
        // Pastikan invoice ada dan ambil data terkait
        $invoice = Invoice::findOrFail($invoiceId);

        // Cari data plan berdasarkan plan_id atau slug yang tersimpan di invoice
        $planData = PackagePlan::where('id', $invoice->plan_id)
            ->orWhere('slug', $invoice->plan_id)
            ->first();

        $plan = [
            'name' => $planData->name ?? ($invoice->package_name ?? 'Paket Membership'),
            'price' => (float) ($planData->price ?? $invoice->amount),
            'features' => $planData->features ?? [],
        ];

        // Perhitungan Pajak (Contoh 11%)
        $subtotal = $invoice->amount / 1.11;
        $tax = $invoice->amount - $subtotal;

        $paymentSettings = PaymentSetting::first();

        return Inertia::render('Vendor/Payment/PaymentPage', [
            'plan' => $plan,
            'tax' => $tax,
            'total' => (float) $invoice->amount,
            'invoiceId' => $invoice->id,
            'vendorBank' => [
                'bank_name' => $paymentSettings->bank_name ?? 'Bank Transfer',
                'account_number' => $paymentSettings->bank_number ?? '-',
                'account_holder_name' => $paymentSettings->account_holder ?? 'Admin',
                'qris_url' => $paymentSettings?->qris_path ? asset('storage/' . $paymentSettings->qris_path) : null,
            ],
        ]);
    }

    /**
     * 2. Halaman Form Upload Bukti (GET)
     */
    public function uploadProofPage(Request $request): Response|RedirectResponse
    {
        // Ambil invoiceId dari query parameter ?invoiceId=...
        $invoiceId = $request->query('invoiceId');

        if (!$invoiceId) {
            return redirect()->route('vendor.membership.index')
                ->with('error', 'Invoice ID diperlukan untuk melakukan konfirmasi.');
        }

        $invoice = Invoice::findOrFail($invoiceId);
        $paymentSettings = PaymentSetting::first();

        return Inertia::render('Vendor/Payment/UploadPaymentProofPage', [
            'invoiceId' => $invoice->id, // Dikirim ke React sebagai props
            'amount' => (float) $invoice->amount,
            'vendorBank' => [
                'bank_name' => $paymentSettings->bank_name ?? '-',
                'account_number' => $paymentSettings->bank_number ?? '-',
                'account_holder_name' => $paymentSettings->account_holder ?? '-',
                'qris_url' => $paymentSettings?->qris_path ? asset('storage/' . $paymentSettings->qris_path) : null,
            ],
        ]);
    }

    /**
     * 3. Proses Simpan Bukti ke Database (POST)
     */
    public function uploadProof(Request $request): RedirectResponse
    {
        $user = Auth::user();
        
        // SINKRONISASI: Menggunakan 'invoice_id' sesuai data yang dikirim dari useForm React
        $request->validate([
            'invoice_id'    => 'required|exists:invoices,id',
            'payment_proof' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'account_name'  => 'required|string|max:255',
        ], [
            'payment_proof.required' => 'Bukti transfer wajib diunggah.',
            'account_name.required'  => 'Nama pemilik rekening wajib diisi.',
        ]);

        $vendorId = $user->vendor?->id;
        if (!$vendorId) {
            return back()->with('error', 'Profil Vendor tidak ditemukan.');
        }

        DB::beginTransaction();
        try {
            // Ambil data invoice
            $invoice = Invoice::findOrFail($request->invoice_id);

            // Cek apakah vendor ini berhak mengupload untuk invoice ini
            if ($invoice->vendor_id && $invoice->vendor_id != $vendorId) {
                return back()->with('error', 'Anda tidak memiliki akses ke invoice ini.');
            }

            // Simpan File ke folder storage/app/public/payment_proofs
            $path = $request->file('payment_proof')->store('payment_proofs', 'public');

            // Simpan atau Update data bukti pembayaran
            // UpdateOrCreate digunakan jika user mengupload ulang karena sebelumnya ditolak
            PaymentProof::updateOrCreate(
                ['invoice_id' => $invoice->id],
                [
                    'vendor_id'    => $vendorId,
                    'account_name' => $request->account_name,
                    'amount'       => $invoice->amount,
                    'file_path'    => $path,
                    'status'       => 'Pending',
                ]
            );

            // Update status invoice menjadi PENDING (menunggu verifikasi admin)
            $invoice->update([
                'status'    => 'PENDING',
                'vendor_id' => $vendorId
            ]);

            DB::commit();

            return redirect()->route('vendor.payment.loading', ['invoice_id' => $invoice->id])
                ->with('success', 'Bukti pembayaran berhasil dikirim. Harap tunggu verifikasi.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Gagal Upload Bukti Vendor: " . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan sistem saat menyimpan data.');
        }
    }

    /**
     * 4. Halaman Status Loading / Menunggu Verifikasi (GET)
     */
    public function paymentLoadingPage(Request $request): Response
    {
        $invoiceId = $request->query('invoice_id');
        $user = Auth::user();
        $vendorId = $user->vendor?->id;

        // Cari invoice berdasarkan ID atau ambil yang terbaru dari vendor ini
        $invoice = Invoice::where('vendor_id', $vendorId)
            ->when($invoiceId, function($query) use ($invoiceId) {
                return $query->where('id', $invoiceId);
            })
            ->latest()
            ->first();

        if (!$invoice) {
            return Inertia::render('Vendor/Payment/LoadingPage', [
                'status' => 'failed',
                'message' => 'Data invoice tidak ditemukan.'
            ]);
        }

        // Map status DB ke status UI React agar tampilan konsisten
        $statusRaw = strtoupper($invoice->status);
        $statusMap = [
            'PAID'      => 'success',
            'REJECTED'  => 'failed',
            'CANCELLED' => 'failed',
            'EXPIRED'   => 'failed',
            'PENDING'   => 'pending',
        ];

        return Inertia::render('Vendor/Payment/LoadingPage', [
            'status'    => $statusMap[$statusRaw] ?? 'pending',
            'invoiceId' => $invoice->id,
            'planName'  => $invoice->package_name ?? 'Paket Membership',
        ]);
    }
}
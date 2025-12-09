<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\PackagePlan;
use App\Models\PaymentProof;
use App\Models\PaymentSetting;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class VendorPaymentFlowController extends Controller
{
    /**
     * 1. Halaman Checkout / Rincian Pembayaran
     * Route: GET /vendor/payment/{invoiceId}
     */
    public function create(Request $request, $invoiceId): Response
    {
        $invoice = Invoice::findOrFail($invoiceId);

        // Ambil data paket (berdasarkan slug atau id)
        $planData = PackagePlan::where('slug', $invoice->plan_id)
            ->orWhere('id', $invoice->plan_id)
            ->first();

        $plan = [
            'name' => $planData->name ?? 'Paket Membership',
            'price' => $planData->price ?? $invoice->amount,
            'features' => $planData->features ?? [],
        ];

        // Hitung display pajak (estimasi 11%)
        $price = $invoice->amount / 1.11;
        $tax = $invoice->amount - $price;
        $total = $invoice->amount;

        // --- PERBAIKAN DI SINI ---
        $paymentSettings = PaymentSetting::first();

        $rekening = [
            // Gunakan '?->' agar jika $paymentSettings null, dia langsung lari ke '??' (default value)
            'bankName' => $paymentSettings?->bank_name ?? 'Bank Transfer',
            'accountNumber' => $paymentSettings?->account_number ?? '-', // Pastikan nama kolom di DB benar (account_number atau bank_number)
            'accountHolder' => $paymentSettings?->account_holder ?? 'Admin',

            // Logika QRIS Aman: Cek apakah objectnya ada DAN pathnya ada
            'qrisUrl' => ($paymentSettings && $paymentSettings->qris_path)
                ? asset('storage/' . $paymentSettings->qris_path)
                : null,
        ];

        return Inertia::render('Vendor/Payment/PaymentPage', [
            'plan' => $plan,
            'tax' => $tax,
            'total' => $total,
            'invoiceId' => $invoice->id,
            'paymentSettings' => $rekening,
        ]);
    }

    /**
     * 2. Halaman Upload Bukti (Form)
     * Route: GET /vendor/payment/upload
     */
    public function uploadProofPage(Request $request): Response
    {
        $data = $request->validate([
            'invoiceId' => 'required',
            'amount' => 'required',
            'account_name' => 'required|string',
        ]);

        return Inertia::render('Vendor/Payment/UploadPaymentProofPage', [
            'invoiceId' => $data['invoiceId'],
            'amount' => (float) $data['amount'],
            'accountName' => $data['account_name'],
            'total' => (float) $data['amount'],
        ]);
    }

    /**
     * 3. Proses Simpan Bukti Pembayaran (FINAL FIX: LINK INVOICE & ANTI-DUPLICATE)
     * Route: POST /vendor/payment/upload
     */
    public function uploadProof(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'invoiceId' => 'required|exists:invoices,id',
            'payment_proof' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'account_name' => 'required|string',
        ]);

        $invoice = Invoice::findOrFail($request->invoiceId);

        DB::beginTransaction();
        try {
            // A. Upload File
            $path = $request->file('payment_proof')->store('payment_proofs', 'public');

            // B. Cek Vendor (Find or Create Logic)
            // Cari vendor yang sudah ada (berdasarkan User ID atau Email) untuk mencegah duplikat
            $vendor = Vendor::where('user_id', $user->id)
                ->orWhere('email', $user->email)
                ->first();

            // Jika benar-benar tidak ada, baru buat baru
            if (!$vendor) {
                // Ambil data legacy dari tabel wedding_organizers jika ada (migrasi data)
                $oldData = $user->weddingOrganizer;

                // Pastikan data tidak NULL dengan fallback values
                $vendorName = ($oldData && !empty($oldData->brand_name)) ? $oldData->brand_name : ($user->name ?? 'Vendor #' . $user->id);
                $vendorPhone = ($oldData && !empty($oldData->phone)) ? $oldData->phone : ($user->phone ?? '-');
                $vendorAddress = ($oldData && !empty($oldData->address)) ? $oldData->address : ($user->address ?? '-');
                $vendorDesc = ($oldData && !empty($oldData->description)) ? $oldData->description : 'Vendor baru terdaftar via pembayaran.';

                $vendor = Vendor::create([
                    'user_id'     => $user->id,
                    'email'       => $user->email,
                    'name'        => $vendorName,
                    'slug'        => Str::slug($vendorName . '-' . uniqid()),
                    'phone'       => $vendorPhone,
                    'address'     => $vendorAddress,
                    'description' => $vendorDesc,
                ]);
            } else {
                // Jika vendor ditemukan tapi user_id belum sinkron, update user_id-nya
                if ($vendor->user_id !== $user->id) {
                    $vendor->update(['user_id' => $user->id]);
                }
            }

            // C. Simpan Bukti Pembayaran
            PaymentProof::create([
                'vendor_id'    => $vendor->id,
                'invoice_id'   => $invoice->id,
                'account_name' => $request->account_name,
                'amount'       => $invoice->amount,
                'file_path'    => $path,
                'status'       => 'Pending', // Menggunakan 'Pending' (Title Case) agar sesuai filter Frontend
            ]);

            // D. Update Invoice (CRITICAL UPDATE)
            $invoice->status = 'PENDING';
            $invoice->vendor_id = $vendor->id; // <--- PENTING: Menghubungkan invoice ke vendor agar terdeteksi di halaman Loading
            $invoice->save();

            DB::commit();

            return redirect()->route('vendor.payment.loading', ['invoice_id' => $invoice->id])
                ->with('success', 'Bukti pembayaran berhasil dikirim.');
        } catch (\Exception $e) {
            DB::rollBack();

            // Bersihkan file jika database gagal agar storage tidak penuh sampah
            if (isset($path)) {
                Storage::disk('public')->delete($path);
            }

            return redirect()->back()->withErrors(['payment_proof' => 'Gagal menyimpan: ' . $e->getMessage()]);
        }
    }

    /**
     * 4. Halaman Loading / Status Real-time (FIXED)
     * Route: GET /vendor/payment/loading
     */
    public function paymentLoadingPage(Request $request): Response
    {
        // 1. PRIORITAS UTAMA: Cek Invoice ID dari URL (dikirim dari uploadProof)
        // Ini menjamin kita mengecek invoice yang BENAR-BENAR baru saja diproses
        if ($request->has('invoice_id')) {
            $lastInvoice = Invoice::find($request->invoice_id);
        } else {
            // 2. FALLBACK: Jika user refresh manual tanpa parameter, cari invoice terakhir vendor
            $user = Auth::user();
            $vendorId = null;
            if ($user->vendor) {
                $vendorId = $user->vendor->id;
            } elseif ($user->weddingOrganizer) {
                $vendorId = $user->weddingOrganizer->id;
            }

            $lastInvoice = Invoice::where('vendor_id', $vendorId)
                ->latest()
                ->first();
        }

        // 3. Tentukan Status
        $currentStatus = 'pending';
        $planName = 'Paket Membership';

        if ($lastInvoice) {
            // Cek nama paket (snapshot atau relasi)
            if (!empty($lastInvoice->package_name)) {
                $planName = $lastInvoice->package_name;
            } elseif ($lastInvoice->packagePlan) {
                $planName = $lastInvoice->packagePlan->name;
            }

            // Logika Status
            if ($lastInvoice->status === 'PAID') {
                $currentStatus = 'success';
            } elseif (in_array($lastInvoice->status, ['CANCELLED', 'EXPIRED', 'REJECTED'])) {
                $currentStatus = 'failed';
            } elseif ($lastInvoice->status === 'PENDING') {
                $currentStatus = 'pending';
            }
        }

        if ($request->has('qrisUrl') && $currentStatus !== 'success') {
            $currentStatus = 'qris';
        }

        return Inertia::render('Vendor/Payment/LoadingPage', [
            'status' => $currentStatus,
            'invoiceId' => $lastInvoice ? $lastInvoice->id : null,
            'planName' => $planName,
            'qrisUrl' => $request->get('qrisUrl'),
        ]);
    }
}

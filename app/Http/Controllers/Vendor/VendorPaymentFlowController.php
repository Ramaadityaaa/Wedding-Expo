<?php

namespace App\Http\Controllers\Vendor; // <<< NAMESPACE VENDOR

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\PackagePlan;
use App\Models\PaymentProof;
use App\Models\PaymentSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

// Class ini mengambil alih semua fungsi dari PaymentController (root)
class VendorPaymentFlowController extends Controller
{
    /**
     * Menampilkan halaman formulir pembayaran.
     */
    public function create(Request $request, $invoiceId): Response
    {
        $invoice = Invoice::findOrFail($invoiceId);
        $planData = PackagePlan::where('slug', $invoice->plan_id)->first();

        $plan = [
            'name' => $planData->name ?? 'Paket Premium',
            'price' => $planData->price ?? 0,
            'features' => $planData->features ?? ['Fitur belum didefinisikan'],
        ];

        $price = $plan['price'];
        $taxRate = 0.11;
        $tax = $price * $taxRate;
        $total = $price + $tax;

        $paymentSettings = PaymentSetting::first();

        $rekening = [
            'bankName' => $paymentSettings->bank_name ?? 'Bank Tujuan (BELUM DIATUR ADMIN)',
            'accountNumber' => $paymentSettings->bank_number ?? '000000000000',
            'accountHolder' => $paymentSettings->account_holder ?? 'PT. Wedding Expo Indonesia',
            'qrisUrl' => $paymentSettings->qris_path ? asset('storage/' . $paymentSettings->qris_path) : null,
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
     * Menampilkan halaman formulir Upload Bukti Pembayaran (GET).
     */
    public function uploadProofPage(Request $request): Response
    {
        $data = $request->validate([
            'invoiceId' => 'required',
            'amount' => 'required|numeric',
            'account_name' => 'required|string',
        ]);

        return Inertia::render('Vendor/Payment/UploadPaymentProofPage', [
            'invoiceId' => $data['invoiceId'],
            'amount' => $data['amount'],
            'accountName' => $data['account_name'],
            'total' => $data['amount'],
        ]);
    }

    /**
     * Menerima POST request untuk menyimpan bukti pembayaran.
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
            $path = $request->file('payment_proof')->store('payment_proofs', 'public');

            PaymentProof::create([
                'vendor_id' => $user->weddingOrganizer->id,
                'invoice_id' => $invoice->id,
                'account_name' => $request->account_name,
                'amount' => $invoice->amount,
                'file_path' => $path,
                'status' => 'PENDING',
            ]);

            $invoice->status = 'PENDING';
            $invoice->save();

            DB::commit();

            return redirect()->route('vendor.payment.loading')
                ->with('success', 'Bukti pembayaran berhasil diupload. Menunggu verifikasi admin.');
        } catch (\Exception $e) {
            DB::rollBack();
            if (isset($path)) {
                Storage::disk('public')->delete($path);
            }
            return redirect()->back()->with('error', 'Gagal menyimpan bukti pembayaran: ' . $e->getMessage());
        }
    }

    /**
     * Menampilkan halaman loading/sukses/tunggu verifikasi (GET).
     */
    public function paymentLoadingPage(Request $request): Response
    {
        $message = $request->session()->get('success')
            ?? $request->get('message')
            ?? 'Transaksi sedang diproses. Silakan tunggu.';

        $status = 'pending';

        if ($request->has('qrisUrl')) {
            $status = 'qris';
        }

        return Inertia::render('Vendor/Payment/LoadingPage', [
            'status' => $status,
            'message' => $message,
            'qrisUrl' => $request->get('qrisUrl'),
        ]);
    }
}

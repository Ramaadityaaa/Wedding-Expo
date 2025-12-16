<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderPayment; // <--- PASTIKAN MODEL BARU INI DI-IMPORT
use App\Models\PackagePlan;
use App\Models\PaymentSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CustomerPaymentFlowController extends Controller
{
    /**
     * 1. Halaman Rincian Pembayaran (Review)
     * Route: GET /customer/payment/{orderId}
     */
    public function create(Request $request, $orderId): Response
    {
        // 1. Ambil Order BESERTA relasi Package dan Vendor-nya (Eager Loading)
        // Ini penting agar di frontend tidak error saat akses order.package.vendor.name
        $order = Order::with(['package.vendor'])->findOrFail($orderId);

        // 2. Ambil detail paket (opsional, untuk memastikan data nama/fitur)
        // Kita fallback ke data yang ada di relasi jika PackagePlan tidak ditemukan
        $planData = PackagePlan::where('slug', $order->package_id)
            ->orWhere('id', $order->package_id)
            ->first();

        $plan = [
            'name' => $planData->name ?? $order->package->name ?? 'Paket Pernikahan',
            'price' => $planData->price ?? $order->amount,
            'features' => $planData->features ?? $order->package->features ?? [],
        ];

        // 3. Hitung PPN & Total (Estimasi 11%)
        $price = $order->amount / 1.11;
        $tax = $order->amount - $price;
        $total = $order->amount;

        // 4. Ambil Rekening Admin (Tujuan Transfer)
        $paymentSettings = PaymentSetting::first();

        $rekening = [
            'bankName' => $paymentSettings?->bank_name ?? 'Bank Transfer',
            'accountNumber' => $paymentSettings?->account_number ?? '-',
            'accountHolder' => $paymentSettings?->account_holder ?? 'Admin',
            'qrisUrl' => ($paymentSettings && $paymentSettings->qris_path)
                ? asset('storage/' . $paymentSettings->qris_path)
                : null,
        ];

        return Inertia::render('Customer/Payment/PaymentPage', [
            'plan' => $plan,
            'tax' => $tax,
            'total' => $total,
            'order' => $order, // Kirim objek order lengkap
            'paymentSettings' => $rekening,
        ]);
    }

    /**
     * 2. Halaman Upload Bukti Pembayaran (Form)
     * Route: GET /customer/payment/upload
     */
    public function uploadProofPage(Request $request): Response
    {
        // Validasi query params yang dikirim dari PaymentPage.jsx
        $data = $request->validate([
            'order_id' => 'required',
            'amount' => 'required',
            'account_name' => 'required|string',
        ]);

        return Inertia::render('Customer/Payment/UploadPaymentProofPage', [
            'orderId' => $data['order_id'],
            'amount' => (float) $data['amount'],
            'accountName' => $data['account_name'],
            'total' => (float) $data['amount'],
        ]);
    }

    /**
     * 3. Proses Simpan Bukti Pembayaran (Action)
     * Route: POST /customer/payment/upload
     */
    public function uploadProof(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'payment_proof' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'account_name' => 'required|string',
        ]);

        $order = Order::findOrFail($request->order_id);

        // --- PERBAIKAN PENTING DI SINI ---
        // Cek apakah pakai kolom 'amount', 'total_price', atau 'price'
        // Jika semuanya null, set ke 0 agar tidak error SQL
        $amount = $order->amount ?? $order->total_price ?? $order->price ?? 0;

        DB::beginTransaction();
        try {
            $path = $request->file('payment_proof')->store('order_payments', 'public');

            OrderPayment::create([
                'order_id' => $order->id,
                'account_name' => $request->account_name,
                'amount' => $amount, // Gunakan variabel yang sudah diamankan
                'proof_file' => $path,
                'status' => 'PENDING',
            ]);

            $order->payment_status = 'PENDING';
            $order->save();

            DB::commit();

            return redirect()->route('customer.payment.loading', ['order_id' => $order->id])
                ->with('success', 'Bukti pembayaran berhasil dikirim.');
        } catch (\Exception $e) {
            DB::rollBack();

            if (isset($path)) {
                Storage::disk('public')->delete($path);
            }

            return redirect()->back()->withErrors(['payment_proof' => 'Gagal menyimpan: ' . $e->getMessage()]);
        }
    }

    /**
     * 4. Halaman Loading / Status Real-time
     * Route: GET /customer/payment/loading
     */
    public function paymentLoadingPage(Request $request): Response
    {
        // Cari order berdasarkan ID di URL, atau ambil order terakhir user
        if ($request->has('order_id')) {
            $lastOrder = Order::find($request->order_id);
        } else {
            $lastOrder = Order::where('customer_id', Auth::id())
                ->latest()
                ->first();
        }

        $currentStatus = 'pending';

        if ($lastOrder) {
            // Mapping status database ke status frontend
            if ($lastOrder->payment_status === 'PAID') {
                $currentStatus = 'success'; // atau 'PAID'
            } elseif (in_array($lastOrder->payment_status, ['CANCELLED', 'EXPIRED', 'REJECTED'])) {
                $currentStatus = 'failed'; // atau 'REJECTED'
            } elseif ($lastOrder->payment_status === 'PENDING') {
                $currentStatus = 'pending';
            }
        }

        return Inertia::render('Customer/Payment/LoadingPage', [
            'status' => $currentStatus, // Status ini yang akan dibaca oleh Polling di React
            'orderId' => $lastOrder ? $lastOrder->id : null,
        ]);
    }
}

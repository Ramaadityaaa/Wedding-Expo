<?php

namespace App\Http\Controllers\Customer; 

use App\Models\Order;
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

class CustomerPaymentFlowController extends Controller
{
    /**
     * 1. Halaman Checkout / Rincian Pembayaran untuk Customer
     * Route: GET /customer/payment/{orderId}
     */
    public function create(Request $request, $orderId): Response
    {
        $order = Order::findOrFail($orderId);

        // Ambil data paket (berdasarkan slug atau id)
        $planData = PackagePlan::where('slug', $order->package_id)
            ->orWhere('id', $order->package_id)
            ->first();

        $plan = [
            'name' => $planData->name ?? 'Paket Pembayaran',
            'price' => $planData->price ?? $order->amount,
            'features' => $planData->features ?? [],
        ];

        // Hitung display pajak (estimasi 11%)
        $price = $order->amount / 1.11;
        $tax = $order->amount - $price;
        $total = $order->amount;

        // --- PERBAIKAN DI SINI --- Ambil data payment settings
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
            'orderId' => $order->id,
            'paymentSettings' => $rekening,
        ]);
    }

    /**
     * 2. Halaman Upload Bukti Pembayaran (Form) untuk Customer
     * Route: GET /customer/payment/upload
     */
    public function uploadProofPage(Request $request): Response
    {
        $data = $request->validate([
            'orderId' => 'required',
            'amount' => 'required',
            'account_name' => 'required|string',
        ]);

        return Inertia::render('Customer/Payment/UploadPaymentProofPage', [
            'orderId' => $data['orderId'],
            'amount' => (float) $data['amount'],
            'accountName' => $data['account_name'],
            'total' => (float) $data['amount'],
        ]);
    }

    /**
     * 3. Proses Simpan Bukti Pembayaran (FINAL FIX: LINK INVOICE & ANTI-DUPLICATE) untuk Customer
     * Route: POST /customer/payment/upload
     */
    public function uploadProof(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'orderId' => 'required|exists:orders,id',
            'payment_proof' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'account_name' => 'required|string',
        ]);

        $order = Order::findOrFail($request->orderId);

        DB::beginTransaction();
        try {
            // A. Upload File
            $path = $request->file('payment_proof')->store('payment_proofs', 'public');

            // C. Simpan Bukti Pembayaran
            PaymentProof::create([
                'vendor_id' => $order->vendor_id, // Vendor terkait dengan Order
                'order_id' => $order->id,
                'account_name' => $request->account_name,
                'amount' => $order->amount,
                'file_path' => $path,
                'status' => 'Pending', // Menggunakan 'Pending' agar sesuai filter frontend
            ]);

            // D. Update Order (Critical Update)
            $order->payment_status = 'PENDING';
            $order->save();

            DB::commit();

            return redirect()->route('customer.payment.loading', ['order_id' => $order->id])
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
     * 4. Halaman Loading / Status Real-time untuk Customer
     * Route: GET /customer/payment/loading
     */
    public function paymentLoadingPage(Request $request): Response
    {
        // Cek Order ID dari URL
        if ($request->has('order_id')) {
            $lastOrder = Order::find($request->order_id);
        } else {
            $lastOrder = Order::where('customer_id', Auth::id())
                ->latest()
                ->first();
        }

        $currentStatus = 'pending';
        if ($lastOrder) {
            // Logika Status
            if ($lastOrder->payment_status === 'PAID') {
                $currentStatus = 'success';
            } elseif (in_array($lastOrder->payment_status, ['CANCELLED', 'EXPIRED', 'REJECTED'])) {
                $currentStatus = 'failed';
            } elseif ($lastOrder->payment_status === 'PENDING') {
                $currentStatus = 'pending';
            }
        }

        return Inertia::render('Customer/Payment/LoadingPage', [
            'status' => $currentStatus,
            'orderId' => $lastOrder ? $lastOrder->id : null,
            'qrisUrl' => $request->get('qrisUrl'),
        ]);
    }
}

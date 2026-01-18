<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\PackagePlan;
use App\Models\Vendor;
use App\Models\User;
use App\Notifications\Vendor\PaymentProofUploadedNotification;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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
        $order = Order::with(['package.vendor'])->findOrFail($orderId);

        $planData = PackagePlan::where('slug', $order->package_id)
            ->orWhere('id', $order->package_id)
            ->first();

        $total = $order->amount ?? $order->total_price ?? $order->price ?? 0;
        $total = (float) $total;

        $price = $total > 0 ? ($total / 1.11) : 0;
        $tax = $total - $price;

        $plan = [
            'name' => $planData->name ?? $order->package->name ?? 'Paket Pernikahan',
            'price' => (float) ($planData->price ?? $total),
            'features' => $planData->features ?? $order->package->features ?? [],
        ];

        return Inertia::render('Customer/Payment/PaymentPage', [
            'plan' => $plan,
            'tax' => $tax,
            'total' => $total,
            'order' => $order,
        ]);
    }

    /**
     * 2. Halaman Upload Bukti Pembayaran (Form)
     * Route: GET /customer/payment/upload
     */
    public function uploadProofPage(Request $request): Response
    {
        $data = $request->validate([
            'order_id' => 'required',
            'amount' => 'required',
        ]);

        $order = Order::with(['package.vendor'])->findOrFail($data['order_id']);
        $vendor = $order->package->vendor;

        $vendorBank = [
            'bank_name' => $vendor->bank_name ?? 'Bank Belum Diatur',
            'account_number' => $vendor->account_number ?? '-',
            'account_holder_name' => $vendor->account_holder_name ?? $vendor->name,
            'qris_url' => $vendor->qris_path ? asset('storage/' . $vendor->qris_path) : null,
        ];

        return Inertia::render('Customer/Payment/UploadPaymentProofPage', [
            'orderId' => $data['order_id'],
            'amount' => (float) $data['amount'],
            'accountName' => '',
            'total' => (float) $data['amount'],
            'vendorBank' => $vendorBank,
        ]);
    }

    /**
     * 3. Proses Simpan Bukti Pembayaran (Action)
     * Route: POST /customer/payment/upload
     */
    public function uploadProof(Request $request): RedirectResponse
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'payment_proof' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'account_name' => 'required|string',
        ]);

        $order = Order::with(['package.vendor'])->findOrFail($request->order_id);

        $amount = $order->amount ?? $order->total_price ?? $order->price ?? 0;
        $amount = (float) $amount;

        DB::beginTransaction();

        try {
            $path = $request->file('payment_proof')->store('order_payments', 'public');

            OrderPayment::updateOrCreate(
                ['order_id' => $order->id],
                [
                    'account_name' => $request->account_name,
                    'amount' => $amount,
                    'proof_file' => $path,
                    'status' => 'PENDING',
                    'bank_source' => 'Manual Transfer',
                ]
            );

            // Status order tetap menunggu verifikasi vendor
            $order->payment_status = 'PENDING';

            // Jika Anda juga memakai kolom status utama, pastikan konsisten
            if (!$order->status) {
                $order->status = 'PENDING';
            }

            $order->save();

            DB::commit();

            // ============================
            // Kirim notif ke vendor
            // ============================
            $vendor = $order->package?->vendor;

            $vendorUser = null;

            // 1) jika Vendor punya relasi user()
            if ($vendor && method_exists($vendor, 'user')) {
                $vendorUser = $vendor->user;
            }

            // 2) jika ada kolom user_id di vendors
            if (!$vendorUser && $vendor?->user_id) {
                $vendorUser = User::find($vendor->user_id);
            }

            // 3) fallback tambahan kalau order punya vendor_id
            if (!$vendorUser && $order->vendor_id) {
                $v = Vendor::find($order->vendor_id);
                if ($v?->user_id) {
                    $vendorUser = User::find($v->user_id);
                }
            }

            if ($vendorUser) {
                $payload = [
                    'title' => 'Bukti pembayaran baru',
                    'message' => 'Customer mengunggah bukti pembayaran. Silakan verifikasi Order ID #' . $order->id,
                    'url' => route('vendor.orders.index', ['status' => 'waiting']),
                    'order_id' => $order->id,
                    'vendor_id' => $vendor?->id ?? $order->vendor_id,

                    // PENTING: agar popup notifikasi bisa menampilkan tanggal order
                    'order_date' => $order->order_date
                        ? Carbon::parse($order->order_date)->toDateString()
                        : null,
                ];

                $vendorUser->notify(new PaymentProofUploadedNotification($payload));
            }
            // ============================

            return redirect()
                ->route('customer.payment.loading', ['order_id' => $order->id])
                ->with('success', 'Bukti pembayaran berhasil dikirim.');
        } catch (\Exception $e) {
            DB::rollBack();

            if (isset($path)) {
                Storage::disk('public')->delete($path);
            }

            return redirect()->back()->withErrors([
                'payment_proof' => 'Gagal menyimpan: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * 4. Halaman Loading / Status Real-time
     * Route: GET /customer/payment/loading
     *
     * FIX: return type harus union karena bisa Inertia::render atau redirect()
     */
    public function paymentLoadingPage(Request $request): Response|RedirectResponse
    {
        if ($request->has('order_id')) {
            $order = Order::with('package.vendor')->find($request->order_id);
        } else {
            // Anda konsisten memakai customer_id di bagian lain
            $order = Order::where('customer_id', Auth::id())
                ->latest()
                ->first();
        }

        if (!$order) {
            return redirect()
                ->route('customer.dashboard')
                ->with('error', 'Pesanan tidak ditemukan');
        }

        $uiStatus = 'pending';
        $statusUpper = strtoupper((string) $order->payment_status);

        if ($statusUpper === 'PAID' || $statusUpper === 'CONFIRMED') {
            $uiStatus = 'success';
        } elseif (in_array($statusUpper, ['CANCELLED', 'EXPIRED', 'REJECTED'], true)) {
            $uiStatus = 'failed';
        }

        return Inertia::render('Customer/Payment/LoadingPage', [
            'status' => $uiStatus,
            'orderId' => $order->id,
            'order' => $order,
        ]);
    }
}

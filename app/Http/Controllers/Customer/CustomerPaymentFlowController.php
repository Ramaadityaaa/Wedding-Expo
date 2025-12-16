<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderPayment;
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
        $order = Order::with(['package.vendor'])->findOrFail($orderId);

        // Fallback untuk data paket jika PackagePlan sudah dihapus/ubah
        $planData = PackagePlan::where('slug', $order->package_id)
            ->orWhere('id', $order->package_id)
            ->first();

        $plan = [
            'name' => $planData->name ?? $order->package->name ?? 'Paket Pernikahan',
            'price' => $planData->price ?? $order->amount,
            'features' => $planData->features ?? $order->package->features ?? [],
        ];

        // Hitung PPN & Total
        // (Asumsi: amount di order sudah termasuk pajak, atau sesuaikan logika bisnis kamu)
        $total = $order->amount ?? $order->total_price ?? $order->price ?? 0;
        $price = $total / 1.11;
        $tax = $total - $price;

        return Inertia::render('Customer/Payment/PaymentPage', [
            'plan' => $plan,
            'tax' => $tax,
            'total' => $total,
            'order' => $order,
            // Catatan: Halaman ini biasanya hanya review. 
            // Data rekening Vendor sebenarnya lebih penting di halaman Upload.
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

        // 1. Ambil Order & Vendor
        $order = Order::with(['package.vendor'])->findOrFail($data['order_id']);
        $vendor = $order->package->vendor;

        // 2. Siapkan Data Bank VENDOR (PENTING: Ini agar dinamis)
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
            // Kirim data bank vendor ke view
            'vendorBank' => $vendorBank,
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

        // FIX: Penanganan harga agar tidak Error / NaN
        $amount = $order->amount ?? $order->total_price ?? $order->price ?? 0;

        DB::beginTransaction();
        try {
            $path = $request->file('payment_proof')->store('order_payments', 'public');

            // Gunakan updateOrCreate: Jika user upload ulang (revisi), data lama ditimpa
            OrderPayment::updateOrCreate(
                ['order_id' => $order->id], // Kunci pencarian
                [
                    'account_name' => $request->account_name,
                    'amount' => $amount,
                    'proof_file' => $path,
                    'status' => 'PENDING',
                    'bank_source' => 'Manual Transfer', // Default value
                ]
            );

            // Update status Order
            $order->payment_status = 'PENDING';
            $order->save();

            DB::commit();

            // Redirect ke Halaman Loading milikmu
            return redirect()->route('customer.payment.loading', ['order_id' => $order->id])
                ->with('success', 'Bukti pembayaran berhasil dikirim.');
        } catch (\Exception $e) {
            DB::rollBack();
            if (isset($path)) Storage::disk('public')->delete($path);

            return redirect()->back()->withErrors(['payment_proof' => 'Gagal menyimpan: ' . $e->getMessage()]);
        }
    }

    /**
     * 4. Halaman Loading / Status Real-time
     * Route: GET /customer/payment/loading
     */
    public function paymentLoadingPage(Request $request): Response
    {
        // Cari order berdasarkan ID di URL
        if ($request->has('order_id')) {
            $order = Order::with('package.vendor')->find($request->order_id);
        } else {
            // Fallback: ambil order terakhir user
            $order = Order::where('user_id', Auth::id()) // Pastikan kolomnya user_id atau customer_id sesuai tabelmu
                ->latest()
                ->first();
        }

        if (!$order) {
            return redirect()->route('customer.dashboard')->with('error', 'Pesanan tidak ditemukan');
        }

        // Tentukan status untuk UI
        $uiStatus = 'pending';
        $statusUpper = strtoupper($order->payment_status);

        if ($statusUpper === 'PAID' || $statusUpper === 'CONFIRMED') {
            $uiStatus = 'success';
        } elseif (in_array($statusUpper, ['CANCELLED', 'EXPIRED', 'REJECTED'])) {
            $uiStatus = 'failed';
        }

        return Inertia::render('Customer/Payment/LoadingPage', [
            'status' => $uiStatus,     // String simple untuk UI ('pending', 'success', 'failed')
            'orderId' => $order->id,
            'order' => $order,         // PENTING: Kirim full object order untuk kebutuhan Polling data di React
        ]);
    }
}

<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Order;
use App\Models\OrderPayment;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class VendorOrderController extends Controller
{
    public function index(): Response|RedirectResponse
    {
        $vendor = Auth::user()->vendor;

        if (!$vendor) {
            return redirect()->route('dashboard')->with('error', 'Akses ditolak.');
        }

        // PERBAIKAN: Pastikan kolom 'status' pada orderPayment ikut diambil
        $orders = Order::whereHas('package', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id);
        })
            ->with([
                'user:id,name,email',
                'package:id,name,price,vendor_id',
                // TAMBAHKAN 'status' DI SINI AGAR FRONTEND TIDAK BINGUNG
                'orderPayment:id,order_id,account_name,bank_source,proof_file,status,amount'
            ])
            ->latest()
            ->paginate(10);

        return Inertia::render('Vendor/pages/OrderManagementPage', [
            'orders' => $orders,
        ]);
    }

    public function verifyPayment(Request $request, $orderId)
    {
        $request->validate([
            'action' => 'required|in:approve,reject',
        ]);

        $order = Order::findOrFail($orderId);

        if ($order->package->vendor_id !== Auth::user()->vendor->id) {
            abort(403, 'Akses ditolak.');
        }

        if ($request->action === 'approve') {
            // SETELAH APPROVE -> JADI PAID
            $order->payment_status = 'PAID';
            $order->status = 'PROCESSED';
            $order->save();

            // Update status pembayaran juga
            $order->orderPayment()->update(['status' => 'VERIFIED']);

            $message = 'Pembayaran diterima. Pesanan diproses.';
        } else {
            // REJECT
            $order->payment_status = 'REJECTED';
            $order->status = 'CANCELLED';
            $order->save();

            $order->orderPayment()->update(['status' => 'REJECTED']);

            $message = 'Pembayaran ditolak. Pesanan dibatalkan.';
        }

        return back()->with('success', $message);
    }
}

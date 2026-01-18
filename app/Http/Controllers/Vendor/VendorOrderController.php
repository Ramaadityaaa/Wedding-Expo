<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\Order;
use Inertia\Inertia;
use Inertia\Response;

class VendorOrderController extends Controller
{
    public function index(Request $request): Response|RedirectResponse
    {
        $vendor = Auth::user()?->vendor;

        if (!$vendor) {
            return redirect()->route('dashboard')->with('error', 'Akses ditolak.');
        }

        $tabStatus = (string) $request->query('status', 'waiting');

        $baseQuery = Order::query()->whereHas('package', function ($q) use ($vendor) {
            $q->where('vendor_id', $vendor->id);
        });

        $ordersQuery = clone $baseQuery;

        switch ($tabStatus) {
            case 'waiting':
                $ordersQuery->whereIn('payment_status', ['PENDING', 'pending']);
                break;

            case 'processed':
                $ordersQuery->where(function ($q) {
                    $q->whereIn('payment_status', ['PAID', 'paid'])
                      ->orWhereIn('status', ['PROCESSED', 'processed']);
                })->whereNotIn('status', ['COMPLETED', 'CANCELLED', 'completed', 'cancelled']);
                break;

            case 'completed':
                $ordersQuery->where(function ($q) {
                    $q->whereIn('status', ['COMPLETED', 'CANCELLED', 'completed', 'cancelled'])
                      ->orWhereIn('payment_status', ['REJECTED', 'rejected']);
                });
                break;

            default:
                $tabStatus = 'waiting';
                $ordersQuery->whereIn('payment_status', ['PENDING', 'pending']);
                break;
        }

        /** @var LengthAwarePaginator $orders */
        $orders = $ordersQuery->with([
            'customer:id,name,email',
            'package:id,name,price,vendor_id',
            'orderPayment:id,order_id,account_name,bank_source,proof_file,status,amount',
        ])
            ->latest()
            ->paginate(10)
            ->appends($request->query());

        $summaryData = [
            'waiting' => (clone $baseQuery)->whereIn('payment_status', ['PENDING', 'pending'])->count(),

            'processed' => (clone $baseQuery)->where(function ($q) {
                $q->whereIn('payment_status', ['PAID', 'paid'])
                  ->orWhereIn('status', ['PROCESSED', 'processed']);
            })->whereNotIn('status', ['COMPLETED', 'CANCELLED', 'completed', 'cancelled'])->count(),

            'completed' => (clone $baseQuery)->where(function ($q) {
                $q->whereIn('status', ['COMPLETED', 'CANCELLED', 'completed', 'cancelled'])
                  ->orWhereIn('payment_status', ['REJECTED', 'rejected']);
            })->count(),
        ];

        return Inertia::render('Vendor/pages/OrderManagementPage', [
            'orders' => $orders,
            'currentStatus' => $tabStatus,
            'summaryData' => $summaryData,
        ]);
    }

    public function verifyPayment(Request $request, $orderId): RedirectResponse
    {
        $request->validate(['action' => 'required|in:approve,reject']);
        $order = Order::with(['package', 'orderPayment'])->findOrFail($orderId);

        if ($order->package->vendor_id !== Auth::user()?->vendor?->id) {
            abort(403);
        }

        if ($request->action === 'approve') {
            $order->update([
                'payment_status' => 'PAID',
                'status' => 'PROCESSED',
            ]);

            if ($order->orderPayment) {
                $order->orderPayment()->update(['status' => 'VERIFIED']);
            }

            $msg = 'Pembayaran diterima. Pesanan dipindahkan ke tab Diproses.';
        } else {
            $order->update([
                'payment_status' => 'REJECTED',
                'status' => 'CANCELLED',
            ]);

            if ($order->orderPayment) {
                $order->orderPayment()->update(['status' => 'REJECTED']);
            }

            $msg = 'Pembayaran ditolak.';
        }

        return back()->with('success', $msg);
    }

    public function completeOrder($orderId): RedirectResponse
    {
        $order = Order::with(['package', 'orderPayment'])->findOrFail($orderId);

        if ($order->package->vendor_id !== Auth::user()?->vendor?->id) {
            abort(403);
        }

        $order->update(['status' => 'COMPLETED']);

        if ($order->orderPayment) {
            $order->orderPayment()->update(['status' => 'COMPLETED']);
        }

        return back()->with('success', 'Pesanan selesai dan dipindahkan ke riwayat.');
    }
}

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
    /**
     * Menampilkan daftar pesanan dengan filter Tab & Summary Count.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $vendor = Auth::user()?->vendor;

        if (!$vendor) {
            return redirect()->route('dashboard')->with('error', 'Akses ditolak.');
        }

        // 1. Ambil Parameter "status" dari Tab (default: waiting)
        $tabStatus = (string) $request->query('status', 'waiting');

        // 2. Query Dasar
        $baseQuery = Order::query()->whereHas('package', function ($q) use ($vendor) {
            $q->where('vendor_id', $vendor->id);
        });

        // 3. Filter Data Utama Berdasarkan Tab
        $ordersQuery = clone $baseQuery;

        switch ($tabStatus) {
            case 'waiting':
                // Tab Menunggu: Status pembayarannya masih PENDING
                $ordersQuery->where('payment_status', 'PENDING');
                break;

            case 'processed':
                // Tab Diproses: Sudah bayar (PAID) atau sedang dikerjakan (PROCESSED)
                // Kecualikan yang sudah selesai/batal
                $ordersQuery->where(function ($q) {
                    $q->where('payment_status', 'PAID')
                        ->orWhere('status', 'PROCESSED'); // <--- Status database 'PROCESSED'
                })->whereNotIn('status', ['COMPLETED', 'CANCELLED']);
                break;

            case 'completed':
                // Tab Selesai: COMPLETED, CANCELLED, atau Payment REJECTED
                $ordersQuery->where(function ($q) {
                    $q->whereIn('status', ['COMPLETED', 'CANCELLED'])
                        ->orWhere('payment_status', 'REJECTED');
                });
                break;

            default:
                // fallback aman kalau status tab aneh
                $tabStatus = 'waiting';
                $ordersQuery->where('payment_status', 'PENDING');
                break;
        }

        // 4. Load Relasi (FIX: GANTI 'user' JADI 'customer')
        /** @var LengthAwarePaginator $orders */
        $orders = $ordersQuery->with([
            'customer:id,name,email', // <--- PENTING: Sesuai nama fungsi di Model Order
            'package:id,name,price,vendor_id',
            'orderPayment:id,order_id,account_name,bank_source,proof_file,status,amount',
        ])
            ->latest()
            ->paginate(10)
            ->appends($request->query()); // ✅ pengganti withQueryString()

        // 5. Hitung Summary Data (Real Count)
        $summaryData = [
            'waiting' => (clone $baseQuery)->where('payment_status', 'PENDING')->count(),

            'processed' => (clone $baseQuery)->where(function ($q) {
                $q->where('payment_status', 'PAID')
                    ->orWhere('status', 'PROCESSED');
            })->whereNotIn('status', ['COMPLETED', 'CANCELLED'])->count(),

            'completed' => (clone $baseQuery)->where(function ($q) {
                $q->whereIn('status', ['COMPLETED', 'CANCELLED'])
                    ->orWhere('payment_status', 'REJECTED');
            })->count(),
        ];

        return Inertia::render('Vendor/pages/OrderManagementPage', [
            'orders' => $orders,
            'currentStatus' => $tabStatus,
            'summaryData' => $summaryData,
        ]);
    }

    /**
     * Verifikasi Pembayaran
     */
    public function verifyPayment(Request $request, $orderId): RedirectResponse
    {
        $request->validate(['action' => 'required|in:approve,reject']);
        $order = Order::findOrFail($orderId);

        if ($order->package->vendor_id !== Auth::user()?->vendor?->id) {
            abort(403);
        }

        if ($request->action === 'approve') {
            // TERIMA: Ubah status jadi PROCESSED agar masuk tab 'Diproses'
            $order->update([
                'payment_status' => 'PAID',
                'status' => 'PROCESSED',
            ]);

            if ($order->orderPayment) {
                $order->orderPayment()->update(['status' => 'VERIFIED']);
            }

            $msg = 'Pembayaran diterima. Pesanan dipindahkan ke tab Diproses.';
        } else {
            // TOLAK
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

    /**
     * Tandai Selesai (Method ini yang dipanggil tombol biru)
     */
    public function completeOrder($orderId): RedirectResponse
    {
        $order = Order::findOrFail($orderId);

        if ($order->package->vendor_id !== Auth::user()?->vendor?->id) {
            abort(403);
        }

        // Ubah status jadi COMPLETED agar pindah ke tab 'Selesai'
        $order->update(['status' => 'COMPLETED']);

        if ($order->orderPayment) {
            $order->orderPayment()->update(['status' => 'COMPLETED']);
        }

        return back()->with('success', 'Pesanan selesai dan dipindahkan ke riwayat.');
    }
}

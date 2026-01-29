<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Package;
use App\Models\Vendor;
use App\Notifications\Vendor\NewOrderNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function selectDate($vendorId, $packageId)
    {
        $vendor = Vendor::find($vendorId);

        $package = Package::where('id', $packageId)
            ->where('vendor_id', $vendorId)
            ->first();

        if (!$vendor || !$package) {
            return back()->with('error', 'Vendor atau Paket yang dipilih tidak ditemukan atau tidak valid.');
        }

        return Inertia::render('Customer/Booking/SelectDate', [
            'vendor'  => $vendor,
            'package' => $package,
        ]);
    }

    public function checkAvailability(Request $request)
    {
        $validated = $request->validate([
            'vendor_id'  => 'required|exists:vendors,id',
            'package_id' => 'required|exists:packages,id',
            'order_date' => 'required|date',
        ]);

        $vendorId  = (int) $validated['vendor_id'];
        $packageId = (int) $validated['package_id'];
        $orderDate = $validated['order_date'];

        $packageValid = Package::where('id', $packageId)
            ->where('vendor_id', $vendorId)
            ->exists();

        if (!$packageValid) {
            return response()->json([
                'available' => false,
                'message'   => 'Paket tidak sesuai dengan vendor yang dipilih.',
            ], 422);
        }

        $maxPerDate = 1;

        // Normalisasi: dukung data lama (pending/paid) + data baru (PENDING/PAID)
        $existingCount = Order::where('vendor_id', $vendorId)
            ->whereDate('order_date', $orderDate)
            ->whereIn('payment_status', ['PENDING', 'PAID', 'pending', 'paid'])
            ->count();

        $available = $existingCount < $maxPerDate;

        return response()->json([
            'available' => $available,
            'count'     => $existingCount,
            'max'       => $maxPerDate,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vendor_id'  => 'required|exists:vendors,id',
            'package_id' => 'required|exists:packages,id',
            'order_date' => 'required|date',
        ]);

        $vendorId  = (int) $validated['vendor_id'];
        $packageId = (int) $validated['package_id'];
        $orderDate = $validated['order_date'];

        $packageValid = Package::where('id', $packageId)
            ->where('vendor_id', $vendorId)
            ->exists();

        if (!$packageValid) {
            return back()->with('error', 'Paket tidak sesuai dengan vendor yang dipilih.');
        }

        $maxPerDate = 1;

        $existingCount = Order::where('vendor_id', $vendorId)
            ->whereDate('order_date', $orderDate)
            ->whereIn('payment_status', ['PENDING', 'PAID', 'pending', 'paid'])
            ->count();

        if ($existingCount >= $maxPerDate) {
            return back()->with('error', 'Vendor ini sudah terpesan pada tanggal tersebut.');
        }

        $order = new Order();
        $order->customer_id    = Auth::id();
        $order->vendor_id      = $vendorId;
        $order->package_id     = $packageId;
        $order->order_date     = $orderDate;

        // Konsisten uppercase supaya filter VendorOrderController tidak pecah
        $order->status         = 'PENDING';
        $order->payment_status = 'PENDING';

        $order->save();

        // Kirim notifikasi ke user vendor
        $vendor = Vendor::with('user')->find($vendorId);
        $vendorUser = $vendor?->user;

        if ($vendorUser) {
            $payload = [
                'title'       => 'Pesanan baru masuk',
                'message'     => 'Ada order baru. Order ID #' . $order->id,
                'url'         => route('vendor.orders.index', ['status' => 'waiting']),
                'order_id'    => $order->id,
                'vendor_id'   => $vendorId,
                'package_id'  => $packageId,
                'customer_id' => $order->customer_id,
            ];

            $vendorUser->notify(new NewOrderNotification($payload));
        }

        return Inertia::location(route('customer.payment.page', ['orderId' => $order->id]));
    }

    public function showPaymentPage($orderId)
    {
        $order = Order::with(['package.vendor', 'customer'])
            ->where('customer_id', Auth::id())
            ->findOrFail($orderId);

        return Inertia::render('Customer/Payment/PaymentPage', [
            'order' => $order,
        ]);
    }

    public function showPaymentInvoice($orderId)
    {
        $order = Order::with(['package.vendor', 'customer'])
            ->where('customer_id', Auth::id())
            ->findOrFail($orderId);

        return Inertia::render('Customer/Payment/InvoicePage', [
            'order' => $order,
        ]);
    }
}

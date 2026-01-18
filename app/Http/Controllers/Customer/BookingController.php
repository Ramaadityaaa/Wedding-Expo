<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Package;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * Menampilkan halaman SelectDate
     */
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
            'vendor' => $vendor,
            'package' => $package,
        ]);
    }

    /**
     * Mengecek ketersediaan tanggal untuk pemesanan.
     * Rule: maksimal 3 order untuk vendor yang sama pada tanggal yang sama.
     */
    public function checkAvailability(Request $request)
    {
        $validated = $request->validate([
            'vendor_id' => 'required|exists:vendors,id',
            'package_id' => 'required|exists:packages,id',
            'order_date' => 'required|date',
        ]);

        $vendorId = (int) $validated['vendor_id'];
        $packageId = (int) $validated['package_id'];
        $orderDate = $validated['order_date'];

        // Pastikan package memang milik vendor yang dipilih
        $packageValid = Package::where('id', $packageId)
            ->where('vendor_id', $vendorId)
            ->exists();

        if (!$packageValid) {
            return response()->json([
                'available' => false,
                'message' => 'Paket tidak sesuai dengan vendor yang dipilih.',
            ], 422);
        }

        $maxPerDate = 3;

        // Hitung booking per vendor per tanggal
        $existingCount = Order::where('vendor_id', $vendorId)
            ->whereDate('order_date', $orderDate)
            ->whereIn('payment_status', ['pending', 'paid']) // failed tidak dihitung agar slot tidak terkunci
            ->count();

        $available = $existingCount < $maxPerDate;

        return response()->json([
            'available' => $available,
            'count' => $existingCount,
            'max' => $maxPerDate,
        ]);
    }

    /**
     * Menyimpan order baru dan redirect ke halaman pembayaran.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'vendor_id' => 'required|exists:vendors,id',
            'package_id' => 'required|exists:packages,id',
            'order_date' => 'required|date',
        ]);

        $vendorId = (int) $validated['vendor_id'];
        $packageId = (int) $validated['package_id'];
        $orderDate = $validated['order_date'];

        // Pastikan package memang milik vendor yang dipilih
        $packageValid = Package::where('id', $packageId)
            ->where('vendor_id', $vendorId)
            ->exists();

        if (!$packageValid) {
            return back()->with('error', 'Paket tidak sesuai dengan vendor yang dipilih.');
        }

        $maxPerDate = 3;

        $existingCount = Order::where('vendor_id', $vendorId)
            ->whereDate('order_date', $orderDate)
            ->whereIn('payment_status', ['pending', 'paid'])
            ->count();

        if ($existingCount >= $maxPerDate) {
            return back()->with('error', 'Vendor ini sudah terpesan 3 kali pada tanggal tersebut.');
        }

        $order = new Order();
        $order->customer_id = Auth::id();
        $order->vendor_id = $vendorId;
        $order->package_id = $packageId;
        $order->order_date = $orderDate;
        $order->status = 'pending';
        $order->payment_status = 'pending';
        $order->save();

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

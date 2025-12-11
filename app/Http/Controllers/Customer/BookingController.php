<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Package;
use App\Models\Vendor; // Model yang digunakan
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
     * Menyimpan order baru dan REDIRECT ke HALAMAN PEMBAYARAN.
     */
    public function store(Request $request)
    {
        // Validasi data
        $request->validate([
            'vendor_id' => 'required|exists:vendors,id',
            'package_id' => 'required|exists:packages,id',
            'order_date' => 'required|date',
        ]);

        // Menyimpan order baru
        $order = new Order;
        $order->customer_id = Auth::id();
        $order->vendor_id = $request->vendor_id;
        $order->package_id = $request->package_id;
        $order->order_date = $request->order_date;
        $order->status = 'pending';
        $order->payment_status = 'pending';
        $order->save();

        // Redirect ke rute HALAMAN PEMBAYARAN BARU
        // Pastikan route 'customer.payment.page' sudah terdaftar di web.php
        return Inertia::location(route('customer.payment.page', ['orderId' => $order->id]));
    }

    /**
     * Menampilkan halaman Pemilihan Metode Pembayaran (PaymentPage.jsx).
     * Data Order, Package, dan Vendor akan dimuat di sini.
     */
    public function showPaymentPage($orderId)
    {
        // Eager Loading Order -> Package -> Vendor sekarang akan berhasil
        $order = Order::with(['package.vendor', 'customer'])
            ->where('customer_id', Auth::id())
            ->findOrFail($orderId);

        return Inertia::render('Customer/Payment/PaymentPage', [
            'order' => $order,
        ]);
    }

    /**
     * Menampilkan halaman Invoice (Mungkin dipanggil dari PaymentPage nanti).
     */
    public function showPaymentInvoice($orderId)
    {
        // Eager Loading Order -> Package -> Vendor
        $order = Order::with(['package.vendor', 'customer'])
            ->where('customer_id', Auth::id())
            ->findOrFail($orderId);

        return Inertia::render('Customer/Payment/InvoicePage', [
            'order' => $order,
        ]);
    }
}
<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Package;
use App\Models\Vendor; // Pastikan ini adalah model yang benar untuk vendor Anda
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BookingController extends Controller
{
    // ... (Fungsi create, showDatePicker, dll. jika ada) ...

    /**
     * Menampilkan halaman SelectDate
     */
    public function selectDate($vendorId, $packageId)
    {
        // Asumsi: Vendor Anda menggunakan model 'Vendor'
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
        return Inertia::location(route('customer.payment.page', ['orderId' => $order->id]));
    }

    /**
     * Menampilkan halaman Pemilihan Metode Pembayaran (PaymentPage.jsx).
     * MENGAMBIL DATA VENDOR DAN PACKAGE MELALUI RELASI ORDER
     */
    public function showPaymentPage($orderId)
    {
        // Cek kembali bagian Eager Loading ini!
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
        // Pastikan order adalah milik customer yang sedang login
        $order = Order::with(['package.vendor', 'customer'])
            ->where('customer_id', Auth::id())
            ->findOrFail($orderId);

        return Inertia::render('Customer/Payment/InvoicePage', [
            'order' => $order,
        ]);
    }
}
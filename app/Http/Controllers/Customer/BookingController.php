<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // Pastikan Auth diimpor
use Inertia\Inertia; // Pastikan Inertia diimpor
use App\Models\Package;  // Pastikan Package diimpor
use App\Models\Vendor;

class BookingController extends Controller
{
    // Menyimpan data pemesanan baru
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
        $order->customer_id = Auth::id(); // Mengambil ID customer yang sedang login
        $order->vendor_id = $request->vendor_id;
        $order->package_id = $request->package_id;
        $order->order_date = $request->order_date;
        $order->status = 'pending'; // Status pemesanan sementara
        $order->payment_status = 'pending'; // Status pembayaran sementara
        $order->save(); // Simpan order ke database

        return response()->json(['message' => 'Order berhasil dibuat!'], 201);
    }

    // Menampilkan form untuk memilih tanggal
    public function showDatePicker($vendorId, $packageId)
    {
        // Ambil data vendor dan package untuk menampilkan informasi
        $vendor = Vendor::findOrFail($vendorId);
        $package = Package::findOrFail($packageId);

        return Inertia::render('Customer/SelectDate', [
            'vendor' => $vendor,
            'package' => $package,
        ]);
    }

    // Halaman pemilihan tanggal
    public function selectDate($vendorId, $packageId)
    {
        // Ambil vendor dan package berdasarkan ID yang diterima
        $vendor = Vendor::findOrFail($vendorId);
        $package = Package::findOrFail($packageId);

        // Kirim data ke frontend untuk ditampilkan di halaman SelectDate
        return Inertia::render('Customer/Booking/SelectDate', [
            'vendor' => $vendor,
            'package' => $package,
        ]);
    }
}

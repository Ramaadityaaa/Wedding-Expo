<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    /**
     * Menampilkan halaman formulir pembayaran.
     */
    public function create(Request $request): Response
    {
        $plan = [
            'name' => 'Paket Premium (Tahunan)',
            'price' => 1200000,
            'features' => [
                'Tampil di Halaman Utama',
                'Galeri Foto (hingga 50 foto)',
                'Manajemen Booking',
                'Dukungan Prioritas'
            ]
        ];

        return Inertia::render('Vendor/Payment/PaymentPage', [
            'plan' => $plan,
            'tax' => $plan['price'] * 0.11, // Contoh PPN 11%
            'total' => $plan['price'] + ($plan['price'] * 0.11)
        ]);
    }

    /**
     * (Contoh) Proses pembayaran di sini.
     */
    public function store(Request $request)
    {
        $request->validate([
            'payment_method' => 'required',
            'cardholder_name' => 'required_if:payment_method,card',
        ]);

        return redirect()->route('vendor.dashboard')
            ->with('success', 'Pembayaran berhasil! Akun Anda telah di-upgrade.');
    }

    /**
     * (FUNGSI BARU)
     * Menyimpan bukti pembayaran dari UploadPaymentProofPage.jsx
     * Ini dipanggil oleh rute: POST /vendor/payment/upload
     */
    public function uploadProof(Request $request)
    {
        $request->validate([
            'payment_proof' => 'required|image|mimes:jpg,jpeg,png,pdf|max:2048', // Max 2MB
            'account_name' => 'required|string',
            'amount' => 'required|numeric',
        ]);

        // 1. Simpan file
        $path = $request->file('payment_proof')->store('proofs', 'public');

        // 2. (OPSIONAL) Simpan info ke database
        // ...

        // 3. Redirect ke halaman hasil (sesuai alur di .jsx)
        // Kita redirect ke halaman 'proof'
        return redirect()->route('vendor.payment.proof')->with('status', 'success');
    }
}
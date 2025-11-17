<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

// Ganti nama class menjadi PaymentController
class PaymentController extends Controller
{
    /**
     * Menampilkan halaman formulir pembayaran.
     */
    public function create(Request $request): Response
    {
        // Logika ini tetap sama
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

        // Path ini sudah benar, merujuk ke:
        // resources/js/Pages/Vendor/Payment/PaymentPage.jsx
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
            // ... validasi lainnya
        ]);

        // Logika ini tetap sama
        return redirect()->route('vendor.dashboard')
            ->with('success', 'Pembayaran berhasil! Akun Anda telah di-upgrade.');
    }

    // ================== AWAL PERBAIKAN ==================
    /**
     * (FUNGSI BARU YANG HILANG)
     * Menyimpan bukti pembayaran dari UploadPaymentProofPage.jsx
     * Ini dipanggil oleh rute: POST /vendor/payment/upload
     */
    public function uploadProof(Request $request)
    {
        $request->validate([
            'payment_proof' => 'required|image|mimes:jpg,jpeg,png|max:10240', // 10MB max
            'account_name' => 'required|string',
            'amount' => 'required|numeric',
        ]);

        // 1. Simpan file
        // 'public' disk akan menyimpan di 'storage/app/public/proofs'
        // Pastikan Anda sudah menjalankan 'php artisan storage:link'
        $path = $request->file('payment_proof')->store('proofs', 'public');

        // 2. (OPSIONAL) Simpan info ke database
        // PaymentProof::create([ ... ]);

        // 3. Redirect ke halaman hasil
        // (Pastikan Anda sudah membuat Vendor/Payment/PaymentProofPage.jsx)
        return redirect()->route('vendor.payment.proof')->with('status', 'success');
    }
    // ================== AKHIR PERBAIKAN ==================
}
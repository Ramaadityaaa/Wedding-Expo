<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionController extends Controller
{
    /**
     * Menampilkan halaman formulir pembayaran.
     * Asumsi: 'plan' dan 'price' bisa didapat dari request,
     * tapi untuk contoh ini kita hardcode.
     */
    public function create(Request $request): Response
    {
        // Anda bisa mengganti ini untuk mengambil data paket secara dinamis
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

        return Inertia::render('Subscribe', [
            'plan' => $plan,
            'tax' => $plan['price'] * 0.11, // Contoh PPN 11%
            'total' => $plan['price'] + ($plan['price'] * 0.11)
        ]);
    }

    /**
     * (Contoh) Proses pembayaran di sini.
     * Nanti Anda akan integrasikan dengan payment gateway (Stripe, Midtrans, dll)
     */
    public function store(Request $request)
    {
        $request->validate([
            'payment_method' => 'required',
            'cardholder_name' => 'required_if:payment_method,card',
            // ... validasi lainnya
        ]);

        // --- Logika Payment Gateway (misal: Midtrans/Stripe) ---
        // 1. Buat transaksi di payment gateway
        // 2. Redirect user ke halaman pembayaran gateway ATAU proses token kartu
        // 3. Setelah sukses, update status langganan vendor
        // ---

        // Untuk sekarang, kita redirect kembali ke dashboard vendor
        // dengan pesan sukses.
        return redirect()->route('vendor.dashboard')
            ->with('success', 'Pembayaran berhasil! Akun Anda telah di-upgrade.');
    }
}
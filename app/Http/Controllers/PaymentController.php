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

        // Ganti nama halaman Inertia yang di-render
        return Inertia::render('PaymentPage', [
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
}
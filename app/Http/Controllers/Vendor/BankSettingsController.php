<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;

class BankSettingsController extends Controller
{
    /**
     * Menampilkan halaman pengaturan rekening bank vendor.
     */
    public function edit()
    {
        $vendor = Auth::user()->vendor;

        // Menggunakan nama komponen: Vendor/pages/BankSettingsPage
        return Inertia::render('Vendor/pages/BankSettingsPage', [
            'bankDetails' => [
                'bank_name' => $vendor->bank_name ?? '',
                'account_number' => $vendor->account_number ?? '',
                'account_holder_name' => $vendor->account_holder_name ?? '',
            ],
        ]);
    }

    /**
     * Memperbarui data rekening bank vendor.
     */
    public function update(Request $request)
    {
        try {
            // Validasi input form
            $request->validate([
                'bank_name' => 'required|string|max:255',
                'account_number' => 'required|string|max:50',
                'account_holder_name' => 'required|string|max:255',
            ]);
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        }

        $vendor = Auth::user()->vendor;

        // Cek apakah vendor ditemukan
        if (!$vendor) {
            return back()->with('error', 'Data vendor tidak ditemukan.');
        }

        // Update data rekening bank
        $vendor->bank_name = $request->bank_name;
        $vendor->account_number = $request->account_number;
        $vendor->account_holder_name = $request->account_holder_name;
        $vendor->save();

        // Redirect kembali dengan pesan sukses
        return back()->with('success', 'Detail rekening bank berhasil diperbarui!');
    }
}

<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage; // <--- WAJIB: Untuk handle file
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;

class BankSettingsController extends Controller
{
    /**
     * Menampilkan halaman pengaturan rekening & QRIS.
     */
    public function edit()
    {
        // Ambil data vendor dari user yang sedang login
        // Pastikan relasi 'vendor' atau 'weddingOrganizer' ada di model User
        $vendor = Auth::user()->vendor;

        return Inertia::render('Vendor/pages/BankSettingsPage', [
            'bankDetails' => [
                'bank_name' => $vendor->bank_name ?? '',
                'account_number' => $vendor->account_number ?? '',
                'account_holder_name' => $vendor->account_holder_name ?? '',

                // Kirim URL lengkap agar bisa dipreview di frontend
                // Jika qris_path ada, buat URL storage. Jika tidak, null.
                'qris_url' => $vendor->qris_path
                    ? asset('storage/' . $vendor->qris_path)
                    : null,
            ],
        ]);
    }

    /**
     * Memperbarui data rekening & upload QRIS.
     */
    public function update(Request $request)
    {
        // 1. Validasi Input
        $request->validate([
            'bank_name' => 'required|string|max:255',
            'account_number' => 'required|string|max:50',
            'account_holder_name' => 'required|string|max:255',
            // Validasi file: harus gambar, maks 2MB (2048 KB)
            'qris_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $vendor = Auth::user()->vendor;

        // 2. Update Data Teks
        $vendor->bank_name = $request->bank_name;
        $vendor->account_number = $request->account_number;
        $vendor->account_holder_name = $request->account_holder_name;

        // 3. Handle Upload QRIS (Jika ada file yang dikirim)
        if ($request->hasFile('qris_image')) {

            // A. Hapus gambar lama jika ada (Biar storage hemat)
            if ($vendor->qris_path && Storage::disk('public')->exists($vendor->qris_path)) {
                Storage::disk('public')->delete($vendor->qris_path);
            }

            // B. Simpan gambar baru ke folder 'vendor_qris' di public disk
            $path = $request->file('qris_image')->store('vendor_qris', 'public');

            // C. Simpan path file ke database
            $vendor->qris_path = $path;
        }

        // 4. Simpan Perubahan ke Database
        $vendor->save();

        return back()->with('success', 'Rekening dan QRIS berhasil diperbarui!');
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaymentSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PaymentSettingsController extends Controller
{
    /**
     * Menampilkan halaman pengaturan pembayaran.
     */
    public function index()
    {
        // Kita ambil setting pertama saja (single row configuration)
        $setting = PaymentSetting::first();

        // Format data agar sesuai dengan props React 'paymentSettings'
        $formattedSetting = [
            'bankAccount' => $setting ? $setting->full_account : 'Belum diatur',
            'qrisImage' => $setting ? $setting->qris_url : null,
            // Kirim raw data juga untuk form edit
            'raw' => $setting
        ];

        return Inertia::render('Admin/pages/PaymentSettings', [
            'paymentSettings' => $formattedSetting
        ]);
    }

    /**
     * Menyimpan/Update pengaturan.
     */
    public function update(Request $request)
    {
        $request->validate([
            'bankNumber' => 'required|string|max:50',
            'bankName' => 'required|string|max:50',
            // 'qrisImage' validasi bisa opsional jika tidak diupload ulang
        ]);

        // Ambil setting yang ada atau buat baru
        $setting = PaymentSetting::firstOrNew([]);

        $setting->bank_number = $request->bankNumber;
        $setting->bank_name = $request->bankName;
        // Default account holder jika tidak ada input
        $setting->account_holder = $setting->account_holder ?? 'Admin';

        // Handle QRIS Upload
        if ($request->hasFile('qrisImage')) {
            // Hapus file lama jika ada
            if ($setting->qris_path && Storage::disk('public')->exists($setting->qris_path)) {
                Storage::disk('public')->delete($setting->qris_path);
            }

            $path = $request->file('qrisImage')->store('settings/qris', 'public');
            $setting->qris_path = $path;
        }

        $setting->save();

        return redirect()->back()->with('success', 'Pengaturan pembayaran berhasil disimpan.');
    }
}

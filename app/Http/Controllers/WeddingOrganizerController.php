<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\WeddingOrganizer;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class WeddingOrganizerController extends Controller
{
    public function store(Request $request)
    {
        Log::info('DEBUG: Request diterima -> ', $request->all());

        $path = null; // Inisialisasi path di luar try-catch

        try {
            // 1. PENAMBAHAN VALIDASI PASSWORD
            $validated = $request->validate([
                'name'              => 'required|string|max:255',
                'vendor_type'       => 'required|string|max:100',
                'city'              => 'required|string|max:100',
                'province'          => 'required|string|max:100',
                'address'           => 'required|string|max:255',
                'permit_number'     => 'required|string|max:50|unique:wedding_organizers,permit_number',
                'permit_image'      => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
                'pic_name'          => 'required|string|max:255',
                'email'             => 'required|email|max:255',
                'whatsapp'          => 'required|string|max:20',
                
                // WAJIB DITAMBAHKAN: Validasi Password
                'password'          => 'required|string|min:8|confirmed', 
                
                'terms_accepted'    => 'accepted',
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error("VALIDATION FAILED: " . json_encode($e->errors()));
            return back()->withErrors($e->errors())->withInput();
        }

        // 2. UPLOAD FILE
        try {
            $path = $request->file('permit_image')->store('permit_images', 'public');
        } catch (\Exception $e) {
            Log::error("UPLOAD FAILED: " . $e->getMessage());
            return back()->withErrors(['permit_image' => 'Gagal upload file'])->withInput();
        }

        // 3. SIMPAN DATA DALAM TRANSAKSI
        DB::beginTransaction();
        try {
            WeddingOrganizer::create([
                'name'              => $validated['name'],
                // PERBAIKAN: Ganti 'type' menjadi 'vendor_type' atau perbaiki Model/DB
                'vendor_type'       => $validated['vendor_type'], 
                'city'              => $validated['city'],
                'province'          => $validated['province'],
                'address'           => $validated['address'],

                'permit_number'     => $validated['permit_number'],
                'permit_image_path' => $path,

                // PERBAIKAN: Ganti pic_name/whatsapp menjadi contact_name/contact_phone (Sesuai Model)
                'contact_name'      => $validated['pic_name'], 
                'contact_email'     => $validated['email'], 
                'contact_phone'     => $validated['whatsapp'],
                
                // WAJIB DITAMBAHKAN: HASHING PASSWORD
                'password'          => Hash::make($validated['password']),
                
                // PERBAIKAN: Gunakan 'PENDING' jika kolom DB adalah ENUM
                'isApproved'        => 'PENDING', 
                // Opsional: Simpan status terms_accepted
                'terms_accepted'    => true, 
            ]);

            DB::commit();
            return redirect()->route('vendor.login')->with('success', 'Pendaftaran berhasil! Silakan login setelah diverifikasi admin.');
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            // Hapus file yang terlanjur di-upload jika terjadi error DB
            if ($path) { 
                Storage::disk('public')->delete($path);
            }
            
            Log::error("DB ERROR: " . $e->getMessage());
            return back()->withErrors(['registration' => 'Gagal menyimpan data ke database.'])->withInput();
        }
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Vendor; // <--- GANTI: Pakai Vendor, Jangan WeddingOrganizer
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Menampilkan Landing Page dengan daftar vendor yang sudah disetujui.
     */
    public function index()
    {
        // PERBAIKAN: Gunakan Vendor model dan cek string 'APPROVED'
        $vendors = Vendor::where('isApproved', 'APPROVED')
            ->withAvg('reviews', 'rating')
            ->orderByDesc('reviews_avg_rating')
            ->orderByDesc('created_at')
            ->take(8)
            ->get()
            ->map(function ($vendor) {
                // Ambil foto cover dari portofolio pertama (jika ada)
                $coverPhoto = null;
                if ($vendor->portfolios && $vendor->portfolios->isNotEmpty()) {
                    $coverPhoto = asset('storage/' . $vendor->portfolios->first()->imageUrl); // Sesuaikan nama kolom path gambar di tabel portfolios
                }

                return [
                    'id' => $vendor->id,
                    'name' => $vendor->name,
                    'city' => $vendor->city ?? 'Indonesia',
                    'description' => $vendor->description,
                    'coverPhoto' => $coverPhoto,
                    'rating' => $vendor->reviews_avg_rating ? number_format($vendor->reviews_avg_rating, 1) : 0,
                    'reviewCount' => $vendor->reviews->count(),
                    'isVerified' => true,
                ];
            });

        return Inertia::render('Customer/Dashboard', [
            'vendors' => $vendors,
        ]);
    }

    /**
     * Halaman form registrasi vendor.
     */
    public function vendorRegister()
    {
        return Inertia::render('Auth/Vendor/RegisterPage');
    }

    /**
     * Menyimpan data registrasi vendor baru (User + VENDOR).
     */
    public function vendorStore(Request $request)
    {
        $rules = [
            'name'           => 'required|string|max:255', // Nama Usaha
            'vendor_type'    => 'required|string|max:100',
            'city'           => 'required|string|max:255',
            'province'       => 'required|string|max:255',
            'address'        => 'required|string|max:1000',
            // Cek unik di tabel VENDORS, bukan wedding_organizers
            'permit_number'  => 'required|string|max:255|unique:vendors,permit_number',
            'permit_image'   => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'pic_name'       => 'required|string|max:255', // Nama Kontak
            'email'          => 'required|email|max:255|unique:users,email',
            'whatsapp'       => 'required|string|max:25',
            'password'       => 'required|string|min:8|confirmed',
            'terms_accepted' => 'accepted',
        ];

        $messages = [
            'terms_accepted.accepted' => 'Harap setujui syarat dan ketentuan.',
            'password.confirmed'      => 'Konfirmasi kata sandi tidak cocok.',
            'permit_number.unique'    => 'Nomor Izin Usaha ini sudah terdaftar.',
            'email.unique'            => 'Email sudah terdaftar di sistem.',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $permitImagePath = null;

        try {
            $permitImagePath = $request->file('permit_image')->store('permit_images', 'public');
        } catch (\Exception $e) {
            Log::error('FILE UPLOAD FAILED: ' . $e->getMessage());
            return back()->withErrors(['permit_image' => 'Gagal mengupload file.'])->withInput();
        }

        DB::beginTransaction();
        try {
            // 1. Buat User Login
            $user = User::create([
                'name'     => $request->pic_name, // Nama User adalah Nama PIC
                'email'    => $request->email,
                'password' => Hash::make($request->password),
                'role'     => 'VENDOR',
                'status'   => 'Active',
            ]);

            // 2. Buat Profil VENDOR (Tabel Baru)
            $vendorData = [
                'user_id'           => $user->id,
                'name'              => $request->name, // Nama Perusahaan

                // Masukkan tipe vendor ke deskripsi jika kolom 'type' tidak ada di tabel vendors
                'description'       => "Jenis Vendor: " . $request->vendor_type,

                'city'              => $request->city,
                'province'          => $request->province,
                'address'           => $request->address,
                'permit_number'     => $request->permit_number,
                'permit_image_path' => $permitImagePath,

                // Mapping Kontak
                'contact_name'      => $request->pic_name,
                'contact_email'     => $request->email,
                'phone'             => $request->whatsapp, // Mapping WA ke Phone

                // STATUS LANGSUNG APPROVED (STRING)
                'isApproved'        => 'PENDING',
                'status'            => 'Active',
            ];

            // Cek jika kolom 'type' benar-benar ada di tabel vendors (opsional)
            // Jika Anda yakin kolom 'type' tidak ada, hapus blok if ini.
            if (Schema::hasColumn('vendors', 'type')) {
                $vendorData['type'] = $request->vendor_type;
            }

            Vendor::create($vendorData);

            DB::commit();

            Auth::login($user);

            // Redirect langsung ke Dashboard karena sudah Approved
            return redirect()
                ->route('vendor.dashboard')
                ->with('success', 'Pendaftaran berhasil! Akun Anda telah aktif.');
        } catch (\Exception $e) {
            DB::rollBack();
            if ($permitImagePath) {
                Storage::disk('public')->delete($permitImagePath);
            }
            Log::error('VENDOR REGISTER FAILED: ' . $e->getMessage());
            return back()->withErrors([
                'registration' => 'Terjadi kesalahan sistem: ' . $e->getMessage(),
            ])->withInput();
        }
    }
}

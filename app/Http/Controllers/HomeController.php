<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\WeddingOrganizer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class HomeController extends Controller
{
    // *** Tambahkan method index jika belum ada ***
    public function index()
    {
        // Sesuaikan dengan logic homepage Anda
        return Inertia::render('Customer/Dashboard', [
            'isLoggedIn' => auth()->check(),
            'message' => 'Selamat datang di Wedding Expo!',
        ]);
    }

    /**
     * Halaman form registrasi vendor (tanpa login).
     */
    public function vendorRegister()
    {
        return Inertia::render('Auth/Vendor/RegisterPage');
    }
    // ********************************************

    /**
     * Menyimpan data registrasi vendor baru (User + WeddingOrganizer).
     */
    public function vendorStore(Request $request)
    {
        // 1. ATURAN VALIDASI
        $rules = [
            'name'           => 'required|string|max:255',
            'vendor_type'    => 'required|string|max:100',
            'city'           => 'required|string|max:255',
            'province'       => 'required|string|max:255',
            'address'        => 'required|string|max:1000',
            'permit_number'  => 'required|string|max:255|unique:wedding_organizers,permit_number',
            'permit_image'   => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'pic_name'       => 'required|string|max:255',
            'email'          => 'required|email|max:255|unique:users,email',
            'whatsapp'       => 'required|string|max:25',
            'password'       => 'required|string|min:8|confirmed',
            'terms_accepted' => 'accepted',

            // Kolom ini ada di request dari React (sync otomatis)
            'contact_name'   => 'required|string|max:255',
            'contact_email'  => 'required|email|max:255',
            'contact_phone'  => 'required|string|max:25',
        ];

        // ... (messages tidak berubah) ...
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

        // 2. UPLOAD FILE
        try {
            $permitImagePath = $request->file('permit_image')->store('permit_images', 'public');
        } catch (\Exception $e) {
            Log::error('FILE UPLOAD FAILED: ' . $e->getMessage());
            return back()->withErrors(['permit_image' => 'Gagal mengupload file.'])->withInput();
        }

        // 3. SIMPAN DATA DALAM TRANSAKSI
        DB::beginTransaction();
        try {
            // LANGKAH A: Buat User Login Dulu
            $user = User::create([
                'name'     => $request->pic_name,
                'email'    => $request->email,
                'password' => Hash::make($request->password),
                'role'     => 'VENDOR',
            ]);

            // LANGKAH B: Buat Profil Wedding Organizer (Pastikan SEMUA KOLOM DIMASUKKAN)
            WeddingOrganizer::create([
                'user_id'           => $user->id,

                'name'              => $request->name, // Nama Brand/Bisnis
                'type'              => $request->vendor_type,
                'city'              => $request->city,
                'province'          => $request->province,
                'address'           => $request->address,

                'permit_number'     => $request->permit_number,
                'permit_image_path' => $permitImagePath,

                'contact_name'      => $request->pic_name,
                'contact_email'     => $request->email,
                'contact_phone'     => $request->whatsapp,

                'password'          => Hash::make($request->password),

                'isApproved'        => 'PENDING',
                'role'              => 'Vendor',
                'terms_accepted'    => true,
            ]);

            DB::commit();

            return redirect()
                ->route('login')
                ->with('success', 'Pendaftaran berhasil! Akun Anda sedang menunggu verifikasi admin.');
        } catch (\Exception $e) {
            DB::rollBack();

            // Hapus file jika gagal database
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

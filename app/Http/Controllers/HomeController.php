<?php

namespace App\Http\Controllers;

use App\Models\WeddingOrganizer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Halaman utama (Homepage customer)
     *
     * Merender resources/js/Pages/Customer/Dashboard.jsx
     * dan mengirimkan list vendor yang sudah disetujui (isApproved = 1).
     */
    public function index()
    {
        // Ambil vendor yang sudah di-approve untuk ditampilkan di homepage
        $vendors = WeddingOrganizer::query()
            ->where('isApproved', 1)
            ->orderByDesc('created_at')
            ->take(12) // kalau mau lebih banyak/lebih sedikit tinggal ubah
            ->get();

        return Inertia::render('Customer/Dashboard', [
            'vendors' => $vendors,
            // auth.user TIDAK perlu dikirim manual, sudah di-share oleh HandleInertiaRequests
        ]);
    }

    /**
     * Halaman form registrasi vendor (tanpa login).
     *
     * Merender resources/js/Pages/Auth/Vendor/RegisterPage.jsx
     */
    public function vendorRegister()
    {
        return Inertia::render('Auth/Vendor/RegisterPage');
    }

    /**
     * Menyimpan data registrasi vendor baru.
     * – Validasi input
     * – Upload file izin usaha
     * – Simpan ke tabel wedding_organizers
     */
    public function vendorStore(Request $request)
    {
        $rules = [
            'name'           => 'required|string|max:255',
            'vendor_type'    => 'required|string|max:100',
            'city'           => 'required|string|max:255',
            'province'       => 'required|string|max:255',
            'address'        => 'required|string|max:1000',
            'permit_number'  => 'required|string|max:255|unique:wedding_organizers,permit_number',
            'permit_image'   => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'pic_name'       => 'required|string|max:255',
            'email'          => 'required|email|max:255|unique:wedding_organizers,contact_email',
            'whatsapp'       => 'required|string|max:25',
            'terms_accepted' => 'accepted',
        ];

        $messages = [
            'terms_accepted.accepted' => 'Harap setujui syarat dan ketentuan.',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            Log::info('VENDOR REGISTER VALIDATION FAILED', $validator->errors()->toArray());

            return back()
                ->withErrors($validator)
                ->withInput();
        }

        $permitImagePath = null;

        // Upload file izin usaha (jika ada)
        if ($request->hasFile('permit_image')) {
            try {
                $permitImagePath = $request->file('permit_image')
                    ->store('permit_images', 'public');
            } catch (\Exception $e) {
                Log::error('VENDOR REGISTER FILE UPLOAD FAILED: '.$e->getMessage());

                return back()
                    ->withErrors(['permit_image' => 'Gagal mengupload file.'])
                    ->withInput();
            }
        }

        try {
            $vendor = new WeddingOrganizer();
            $vendor->name              = $request->name;
            $vendor->type              = $request->vendor_type;   // sesuaikan dengan nama kolom di DB (type atau vendor_type)
            $vendor->city              = $request->city;
            $vendor->province          = $request->province;
            $vendor->address           = $request->address;
            $vendor->permit_number     = $request->permit_number;
            $vendor->permit_image_path = $permitImagePath;
            $vendor->contact_name      = $request->pic_name;
            $vendor->contact_email     = $request->email;
            $vendor->contact_phone     = $request->whatsapp;

            // default password sementara (nanti bisa diubah via email aktifasi / reset password)
            $vendor->password  = Hash::make('12345678');
            $vendor->user_id   = null;
            $vendor->isApproved = 0; // 0 = menunggu verifikasi admin

            // kalau kamu punya field terms_accepted di tabel, bisa di-set juga:
            // $vendor->terms_accepted = true;

            $vendor->save();

            return redirect()
                ->route('vendor.register')
                ->with('success', 'Pendaftaran berhasil! Menunggu verifikasi admin.');
        } catch (\Exception $e) {
            Log::error('VENDOR REGISTER STORE FAILED: '.$e->getMessage());

            // rollback file jika ada error simpan database
            if ($permitImagePath) {
                Storage::disk('public')->delete($permitImagePath);
            }

            return back()
                ->withErrors([
                    'registration' => 'Terjadi kesalahan saat menyimpan data.',
                ])
                ->withInput();
        }
    }

    /*
    |--------------------------------------------------------------------------
    | (OPSIONAL) Tempat menambahkan registrasi customer di masa depan
    |--------------------------------------------------------------------------
    |
    | public function customerRegister() { ... }
    | public function customerStore(Request $request) { ... }
    |
    | Kamu bisa taruh di bawah ini nanti kalau sudah siap struktur tabel user/customer.
    */
}

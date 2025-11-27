<?php

namespace App\Http\Controllers;

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
    /**
     * Tampilkan halaman beranda (index) untuk rute '/'.
     * Ini menyelesaikan BadMethodCallException.
     */
    public function index()
    {
        // Rute '/' (home) akan menampilkan Dashboard Customer/Visitor,
        // sesuai dengan definisi Inertia di routes/web.php.
        // Jika Anda ingin ini berbeda dari Dashboard setelah login,
        // Anda mungkin ingin membuat Pages/Welcome.jsx terpisah.
        return Inertia::render('Customer/Dashboard', [
            // Contoh data yang mungkin ingin Anda kirim ke halaman beranda
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


    /**
     * Menyimpan data registrasi vendor baru.
     */
    public function vendorStore(Request $request)
    {
        // 1. ATURAN VALIDASI LENGKAP
        $rules = [
            'name'           => 'required|string|max:255',
            'vendor_type'    => 'required|string|max:100', // Nama input: vendor_type
            'city'           => 'required|string|max:255',
            'province'       => 'required|string|max:255',
            'address'        => 'required|string|max:1000',
            'permit_number'  => 'required|string|max:255|unique:wedding_organizers,permit_number',
            'permit_image'   => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'pic_name'       => 'required|string|max:255', 
            'email'          => 'required|email|max:255|unique:wedding_organizers,contact_email',
            'whatsapp'       => 'required|string|max:25',
            'password'       => 'required|string|min:8|confirmed', 
            'terms_accepted' => 'accepted',
        ];

        $messages = [
            'terms_accepted.accepted' => 'Harap setujui syarat dan ketentuan.',
            'password.confirmed'      => 'Konfirmasi kata sandi tidak cocok.',
            'permit_number.unique'    => 'Nomor Izin Usaha ini sudah terdaftar.',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            Log::info('VENDOR REGISTER VALIDATION FAILED', $validator->errors()->toArray());
            return back()->withErrors($validator)->withInput();
        }

        $permitImagePath = null;

        // 2. UPLOAD FILE
        try {
            $permitImagePath = $request->file('permit_image')->store('permit_images', 'public');
        } catch (\Exception $e) {
            Log::error('VENDOR REGISTER FILE UPLOAD FAILED: ' . $e->getMessage());
            return back()->withErrors(['permit_image' => 'Gagal mengupload file.'])->withInput();
        }

        // 3. SIMPAN DATA DALAM TRANSAKSI
        DB::beginTransaction();
        try {
            WeddingOrganizer::create([
                'name'              => $request->name,
                // Menggunakan 'type' yang sesuai dengan kolom DB
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
                'terms_accepted'    => true, 
                'user_id'           => null, 
            ]);

            DB::commit();
            
            // PERBAIKAN: Mengubah redirect ke rute 'login'
            return redirect()
                ->route('login') 
                ->with('success', 'Pendaftaran berhasil! Silakan login setelah diverifikasi admin.');
        } catch (\Exception $e) {
            DB::rollBack();
            // Rollback file jika ada error simpan database
            if ($permitImagePath) {
                Storage::disk('public')->delete($permitImagePath);
            }
            
            Log::error('VENDOR REGISTER STORE FAILED: ' . $e->getMessage());
            return back()->withErrors([
                'registration' => 'Terjadi kesalahan saat menyimpan data. Error: ' . $e->getMessage(),
            ])->withInput();
        }
    }
}
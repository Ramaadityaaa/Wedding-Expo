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
     * Halaman utama (Homepage)
     */
    public function index()
    {
        return Inertia::render('Dashboard'); 
    }

    /**
     * Halaman register vendor
     */
    public function vendorRegister()
    {
        return Inertia::render('Auth/Vendor/RegisterPage');
    }

    /**
     * Store data vendor
     */
    public function vendorStore(Request $request)
    {
        $rules = [
            'name'             => 'required|string|max:255',
            'vendor_type'      => 'required|string|max:100',
            'city'             => 'required|string|max:255',
            'province'         => 'required|string|max:255',
            'address'          => 'required|string|max:1000',
            'permit_number'    => 'required|string|max:255|unique:wedding_organizers,permit_number',
            'permit_image'     => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'pic_name'         => 'required|string|max:255',
            'email'            => 'required|email|max:255|unique:wedding_organizers,contact_email',
            'whatsapp'         => 'required|string|max:25',
            'terms_accepted'   => 'accepted',
        ];

        $messages = [
            'terms_accepted.accepted' => 'Harap setujui syarat dan ketentuan.',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            Log::info('VALIDATION FAILED', $validator->errors()->toArray());
            return back()->withErrors($validator)->withInput();
        }

        $permitImagePath = null;

        if ($request->hasFile('permit_image')) {
            try {
                $permitImagePath = $request->file('permit_image')->store('permit_images', 'public');
            } catch (\Exception $e) {
                Log::error('FILE UPLOAD FAILED: ' . $e->getMessage());
                return back()->withErrors(['permit_image' => 'Gagal mengupload file.'])->withInput();
            }
        }

        try {
            $vendor = new WeddingOrganizer();
            $vendor->name               = $request->name;
            $vendor->type               = $request->vendor_type;
            $vendor->city               = $request->city;
            $vendor->province           = $request->province;
            $vendor->address            = $request->address;
            $vendor->permit_number      = $request->permit_number;
            $vendor->permit_image_path  = $permitImagePath;
            $vendor->contact_name       = $request->pic_name;
            $vendor->contact_email      = $request->email;
            $vendor->contact_phone      = $request->whatsapp;
            $vendor->password           = Hash::make('12345678');
            $vendor->user_id            = null;
            $vendor->isApproved         = 0;

            $vendor->save();

            return redirect()
                ->route('vendor.register')
                ->with('success', 'Pendaftaran berhasil! Menunggu verifikasi admin.');

        } catch (\Exception $e) {

            Log::error('STORE FAILED: ' . $e->getMessage());

            if ($permitImagePath) {
                Storage::disk('public')->delete($permitImagePath);
            }

            return back()->withErrors([
                'registration' => 'Terjadi kesalahan saat menyimpan data.'
            ])->withInput();
        }
    }
}

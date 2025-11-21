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

        try {
            $validated = $request->validate([
                'name'            => 'required|string|max:255',
                'vendor_type'     => 'required|string|max:100',
                'city'            => 'required|string|max:100',
                'province'        => 'required|string|max:100',
                'address'         => 'required|string|max:255',

                'permit_number'   => 'required|string|max:50|unique:wedding_organizers,permit_number',
                'permit_image'    => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',

                'pic_name'        => 'required|string|max:255',
                'email'           => 'required|email|max:255',
                'whatsapp'        => 'required|string|max:20',

                'terms_accepted'  => 'accepted',
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error("VALIDATION FAILED: " . json_encode($e->errors()));
            return back()->withErrors($e->errors())->withInput();
        }

        // Upload file
        try {
            $path = $request->file('permit_image')->store('permit_images', 'public');
        } catch (\Exception $e) {
            Log::error("UPLOAD FAILED: " . $e->getMessage());
            return back()->withErrors(['permit_image' => 'Gagal upload file'])->withInput();
        }

        DB::beginTransaction();
        try {
            WeddingOrganizer::create([
                'name'              => $validated['name'],
                'type'              => $validated['vendor_type'],
                'city'              => $validated['city'],
                'province'          => $validated['province'],
                'address'           => $validated['address'],

                'permit_number'     => $validated['permit_number'],
                'permit_image_path' => $path,

                'contact_name'      => $validated['pic_name'],
                'contact_email'     => $validated['email'],
                'contact_phone'     => $validated['whatsapp'],

                'isApproved'        => false,
            ]);

            DB::commit();
            return redirect()->route('vendor.login')->with('success', 'Pendaftaran berhasil!');
        } catch (\Exception $e) {
            DB::rollBack();
            Storage::disk('public')->delete($path);
            Log::error("DB ERROR: " . $e->getMessage());
            return back()->withErrors(['registration' => 'Gagal menyimpan data'])->withInput();
        }
    }
}


<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class VendorRegistrationRequest extends FormRequest
{
    /**
     * Tentukan apakah user diizinkan untuk membuat request ini.
     */
    public function authorize(): bool
    {
        // Karena ini adalah form registrasi publik, kita izinkan
        return true;
    }

    /**
     * Dapatkan aturan validasi yang berlaku untuk request.
     * Aturan ini mencakup data untuk tabel users dan wedding_organizers.
     */
    public function rules(): array
    {
        return [
            // --- Aturan untuk Tabel Users (Kolom 'name', 'email', 'password', 'phone') ---
            'name' => ['required', 'string', 'max:255'], // Nama Vendor/Pemilik Akun (Nama Kontak Person)
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            // Validasi Password: minimum 8 karakter, harus dikonfirmasi (password_confirmation)
            'password' => ['required', 'string', 'min:8', 'confirmed', Password::defaults()],
            'phone' => ['required', 'string', 'max:15'], // Nomor WhatsApp

            // --- Aturan untuk Tabel WeddingOrganizer (Data Bisnis) ---
            'company_name' => ['required', 'string', 'max:255'], // Nama Perusahaan/Studio
            'vendor_type' => ['required', 'string', 'max:50'], // Jenis Layanan Utama
            'city' => ['required', 'string', 'max:100'], // Kota/Provinsi Layanan
            'address' => ['required', 'string', 'max:500'], // Alamat Perusahaan
            
            // Dokumen Legalitas
            'permit_number' => ['required', 'string', 'max:50', 'unique:wedding_organizers'], // Nomor Izin Usaha
            'permit_image' => ['required', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'], // File Izin Usaha (Maks 5MB)
        ];
    }
    
    /**
     * Kustomisasi pesan error.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama pemilik akun wajib diisi.',
            'email.unique' => 'Email ini sudah terdaftar. Silakan gunakan email lain.',
            'password.required' => 'Password wajib diisi.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'password.min' => 'Password minimal 8 karakter.',
            'phone.required' => 'Nomor WhatsApp wajib diisi.',
            
            'company_name.required' => 'Nama perusahaan/bisnis wajib diisi.',
            'vendor_type.required' => 'Jenis layanan wajib dipilih.',
            'city.required' => 'Kota/Provinsi layanan wajib diisi.',
            'address.required' => 'Alamat perusahaan wajib diisi.',
            
            'permit_number.required' => 'Nomor Izin Usaha wajib diisi.',
            'permit_number.unique' => 'Nomor Izin Usaha ini sudah terdaftar.',
            'permit_image.required' => 'Dokumen Legalitas wajib diupload.',
            'permit_image.mimes' => 'Format file legalitas harus JPG, PNG, atau PDF.',
            'permit_image.max' => 'Ukuran file legalitas maksimal 5MB.',
        ];
    }
}
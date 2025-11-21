<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable; 
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Class WeddingOrganizer
 * Model ini mewakili entitas vendor (Wedding Organizer, Catering, dll.)
 * Menggunakan Authenticatable agar dapat digunakan untuk otentikasi (login)
 */
class WeddingOrganizer extends Authenticatable
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     * Semua kolom yang akan diisi melalui WeddingOrganizer::create() atau ::update()
     * harus dimasukkan di sini. Ini memperbaiki masalah "Mass Assignment".
     */
    protected $fillable = [
        // Kolom Otentikasi & Kontak
        'email', 
        'password', 
        'pic_name',          // Nama Kontak Person
        'whatsapp',          // Nomor WhatsApp Kontak
        'isApproved',        // Status persetujuan dari Admin (boolean)
        'terms_accepted',    // Status persetujuan Syarat & Ketentuan (boolean)

        // Informasi Vendor
        'name',              // Nama Bisnis/Perusahaan
        'vendor_type',       // Jenis Layanan (mis. 'WO', 'Catering', 'Dekorasi')
        'address',           // Alamat Lengkap
        'city',              // Kota Layanan
        'province',          // Provinsi Layanan
        'phone',             // Nomor telepon umum

        // Legalitas & File Upload
        'permit_number',     // Nomor Izin Usaha (NIB/SIUP)
        'permit_image_path', // Path lokasi file Izin Usaha yang diupload

        // Kolom Lain
        'user_id',           // ID user jika ada relasi ke tabel users
        'description', 
        'logo', 
        'coverPhoto', 
        'website', 
        'instagram', 
        'facebook', 
        'contact_name',      // Kolom baru untuk nama kontak
        'contact_email',     // Kolom baru untuk email kontak
        'contact_phone',     // Kolom baru untuk nomor telepon kontak
    ];

    /**
     * The attributes that should be hidden for arrays.
     * Kolom yang tidak akan disertakan saat Model dikonversi ke array/JSON (untuk keamanan).
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the user that owns the Wedding Organizer (jika ada relasi).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the packages for the Wedding Organizer.
     */
    public function packages(): HasMany
    {
        return $this->hasMany(Package::class);
    }
}

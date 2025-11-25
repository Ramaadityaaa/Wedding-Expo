<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable; 
// 🚨 PERBAIKAN: Tambahkan import untuk BelongsTo dan HasMany
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WeddingOrganizer extends Authenticatable
{
    use HasFactory;

    protected $fillable = [
        // ... (data bisnis)
        'name',
        'type', // Kolom DB yang benar (bukan 'vendor_type')
        'city',
        'province',
        'address',
        
        // ... (data legalitas)
        'permit_number',
        'permit_image_path',
        
        // ... (data kontak)
        'contact_name', 
        'contact_email', 
        'contact_phone', 
        
        // ... (data akun & status)
        'password',
        'isApproved', 
        'terms_accepted', 
        'user_id',
        
        // Kolom Opsional Lainnya (Pastikan semua kolom ini ada di DB dan $fillable jika digunakan)
        'description',
        'logo',
        'coverPhoto',
        'website',
        'instagram',
        'facebook',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Relasi ke model User (misalnya, jika setiap vendor terhubung ke akun admin/sistem)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke Packages yang dimiliki oleh vendor ini.
     */
    public function packages(): HasMany
    {
        return $this->hasMany(Package::class);
    }
}
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

    // --- PERBAIKAN DITAMBAHKAN: Mengatur nilai default ---
    /**
     * Set default values for model attributes.
     * Ini memastikan 'isApproved' adalah 0 (PENDING) jika tidak disetel saat creation.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'isApproved' => 0,
    ];
    // ---------------------------------------------------

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
        'isApproved', // Pertahankan ini di $fillable
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
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            // Casting ke integer memastikan isApproved selalu dinilai sebagai angka (0 atau 1)
            'isApproved' => 'integer',
        ];
    }
    
    /**
     * Relasi ke model User
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke Packages
     */
    public function packages(): HasMany
    {
        return $this->hasMany(Package::class);
    }

    /**
     * Relasi ke Portfolio
     */
    public function portfolios(): HasMany
    {
        return $this->hasMany(Portfolio::class);
    }
    
    /**
     * Relasi ke Reviews
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
    
    /**
     * Relasi ke Favorites
     */
    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }
}
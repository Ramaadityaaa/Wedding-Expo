<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WeddingOrganizer extends Authenticatable
{
    use HasFactory;

    // --- KOREKSI: Mengatur nilai default sebagai string ENUM (PENDING) ---
    /**
     * Set default values for model attributes.
     * Ini memastikan 'isApproved' adalah 'PENDING' jika tidak disetel saat creation.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        // Asumsi ENUM di DB adalah string 'PENDING', 'APPROVED', 'REJECTED'
        'isApproved' => 'PENDING',
    ];
    // ---------------------------------------------------

    protected $fillable = [
        // ... (data bisnis)
        'name',
        'type',
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
        'role', // <--- TAMBAHAN: Agar kolom role bisa diupdate massal
        'terms_accepted',
        'user_id',

        // Kolom Opsional Lainnya
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
        // 🚨 KOREKSI: Hapus casting 'isApproved' => 'integer', karena Anda menggunakan string di Controller
        return [];
    }

    /**
     * Relasi ke model User (Pemilik Vendor)
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

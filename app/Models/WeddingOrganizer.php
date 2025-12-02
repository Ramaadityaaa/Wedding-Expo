<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WeddingOrganizer extends Authenticatable
{
    use HasFactory;

    // Tentukan nama tabel
    protected $table = 'wedding_organizers';

    /**
     * Set default values for model attributes.
     */
    protected $attributes = [
        'isApproved' => 'PENDING',
        'role' => 'Vendor', // Set default role
    ];

    /**
     * The attributes that are mass assignable.
     * SEMUA kolom yang diisi di HomeController harus ada di sini.
     */
    protected $fillable = [
        // RELASI & STATUS
        'user_id',
        'isApproved',
        'role',
        'terms_accepted',

        // DATA BISNIS
        'name',
        'type',
        'city',
        'province',
        'address',

        // LEGALITAS
        'permit_number',
        'permit_image_path',

        // DATA KONTAK
        'contact_name',
        'contact_email',
        'contact_phone',

        // AKUN (hanya digunakan saat create/update)
        'password',

        // Opsional Lainnya
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

    protected function casts(): array
    {
        return [];
    }

    // --- RELATIONS ---

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function packages(): HasMany
    {
        return $this->hasMany(Package::class);
    }

    public function portfolios(): HasMany
    {
        return $this->hasMany(Portfolio::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }
}

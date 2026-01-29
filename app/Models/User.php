<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

// --- GANTI INI: Pakai Model Vendor, bukan WeddingOrganizer ---
use App\Models\Vendor;
use App\Models\Review;
use App\Models\Favorite;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'status',
        'profile_photo_path', // Saya tambahkan ini jaga-jaga jika dipakai profile
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $attributes = [
        'status' => 'Active',
        'role' => 'USER',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Relasi Utama ke Vendor (Tabel Baru)
     */
    public function vendor(): HasOne
    {
        // PERBAIKAN: Hubungkan ke Model Vendor
        return $this->hasOne(Vendor::class, 'user_id');
    }

    // Fungsi weddingOrganizer() SAYA HAPUS karena tabelnya sudah tidak dipakai.
    // Jika masih ada kodingan lama yang memanggil $user->weddingOrganizer, 
    // silakan ganti kodingan tersebut menjadi $user->vendor

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }
}

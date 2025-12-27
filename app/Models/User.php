<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

use App\Models\WeddingOrganizer;
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
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    protected $attributes = [
        'status' => 'Active',
        'role' => 'USER',
    ];

    // Relasi utama untuk mengecek profil vendor (WeddingOrganizer)
    public function vendor(): HasOne
    {
        return $this->hasOne(WeddingOrganizer::class, 'user_id');
    }

    // Alias jika ada bagian kode lain yang memanggil nama ini
    public function weddingOrganizer(): HasOne
    {
        return $this->hasOne(WeddingOrganizer::class, 'user_id');
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

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
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
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Nilai default untuk atribut model.
     */
    protected $attributes = [
        'status' => 'Active',
        'role' => 'USER',
    ];

    // --- RELASI ---

    /**
     * Relasi ke Vendor (SISTEM BARU)
     * Ini WAJIB ADA agar Controller Portfolio bisa membaca: $user->vendor
     */
    public function vendor(): HasOne
    {
        return $this->hasOne(WeddingOrganizer::class, 'user_id');
    }

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

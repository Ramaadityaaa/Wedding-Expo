<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WeddingOrganizer extends Authenticatable
{
    use HasFactory;

    protected $table = 'wedding_organizers';

    protected $attributes = [
        'isApproved' => 'PENDING',
        'role' => 'Vendor',
    ];

    protected $fillable = [
        'user_id',
        'isApproved',
        'role',
        'terms_accepted',

        'name',
        'type',
        'city',
        'province',
        'address',

        'permit_number',
        'permit_image_path',

        'bank_name',
        'account_number',
        'account_holder_name',
        'qris_path',

        'contact_name',
        'contact_email',
        'contact_phone',

        'password',

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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function packages(): HasMany
    {
        return $this->hasMany(Package::class, 'vendor_id');
    }

    public function portfolios(): HasMany
    {
        return $this->hasMany(Portfolio::class, 'vendor_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class, 'vendor_id');
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class, 'vendor_id');
    }
}

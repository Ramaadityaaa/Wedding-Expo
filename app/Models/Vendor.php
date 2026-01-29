<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\User;
use App\Models\Package;
use App\Models\Portfolio;
use App\Models\Review;

class Vendor extends Model
{
    use HasFactory;

    protected $table = 'vendors'; // Pastikan nama tabel benar

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'description',
        'address',
        'city',
        'province',
        'phone',

        'contact_name',
        'contact_email',

        'permit_number',
        'permit_image_path',
        'isApproved',
        'rejection_reason',

        'bank_name',
        'account_number',
        'account_holder_name',
        'qris_path',

        'logo',
        'cover_photo',
        'website',
        'instagram',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function packages()
    {
        return $this->hasMany(Package::class);
    }

    public function portfolios()
    {
        return $this->hasMany(Portfolio::class, 'vendor_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'vendor_id');
    }
}

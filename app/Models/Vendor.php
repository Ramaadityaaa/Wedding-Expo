<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{
    use HasFactory;

    // sesuaikan fillable kamu kalau beda
    protected $fillable = [
        'user_id',
        'name',
        'address',
        'logo',
        'description',
        'phone',
        'contact',
        'isApproved',
        'rejection_reason',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function packages()
    {
        return $this->hasMany(Package::class, 'vendor_id');
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

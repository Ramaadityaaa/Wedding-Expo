<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{
    use HasFactory;

    protected $table = 'vendors';

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'email',
        'phone',
        'address',
        'description',
        'logo',
        'banner',
        'status', // <--- PENTING: Kolom baru ini wajib ditambahkan
    ];

    /**
     * Relasi ke User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke Bukti Pembayaran
     */
    public function paymentProofs()
    {
        return $this->hasMany(PaymentProof::class, 'vendor_id');
    }

    /**
     * Relasi ke Paket Jasa
     */
    public function packages()
    {
        return $this->hasMany(Package::class);
    }

    /**
     * Relasi ke Portofolio
     */
    public function portfolios()
    {
        return $this->hasMany(Portfolio::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}

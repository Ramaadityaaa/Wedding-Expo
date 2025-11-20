<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{
    use HasFactory;

    protected $table = 'vendors';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'company_name',
        'address',
        'password',
        'status',
    ];

    // Relasi ke PaymentProof
    public function paymentProofs()
    {
        return $this->hasMany(PaymentProof::class, 'vendor_id');
    }
}

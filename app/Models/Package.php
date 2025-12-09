<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    use HasFactory;

    protected $fillable = [
        'vendor_id',
        'name',
        'price',
        'description',
        'features',
    ];

    // Casting JSON ke Array otomatis
    protected $casts = [
        'features' => 'array',
        'price' => 'decimal:2',
    ];

    // Relasi ke Vendor
    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    use HasFactory;

    protected $fillable = [
        'vendor_id', // Pastikan ini vendor_id
        'name',
        'price',
        'description',
        'features', // Jika pakai JSON cast
    ];

    protected $casts = [
        'features' => 'array',
    ];

    // Relasi balik ke WeddingOrganizer (Vendor)
    public function vendor()
    {
        // Parameter 2: Foreign Key di tabel packages
        return $this->belongsTo(WeddingOrganizer::class, 'vendor_id');
    }
}

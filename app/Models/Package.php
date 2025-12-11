<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// Pastikan ini diimpor (Ganti ke 'Vendor' jika itu nama Model Anda yang benar)
use App\Models\Vendor; 

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

    protected $casts = [
        'features' => 'array',
    ];

    /**
     * Relasi ke Model Vendor (Perbaikan: Menunjuk ke Vendor::class)
     */
    public function vendor()
    {
        // Model target adalah Vendor::class
        return $this->belongsTo(Vendor::class, 'vendor_id');
    }
}
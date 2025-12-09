<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Portfolio extends Model
{
    use HasFactory;

    // Pastikan fillable sesuai dengan migrasi baru
    protected $fillable = [
        'vendor_id',    // <--- PENTING: Sudah ganti dari wedding_organizer_id
        'title',
        'description',
        'imageUrl',
        'videoUrl',
        'isPublished',
    ];

    // Relasi ke Vendor (Sistem Baru)
    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    // Accessor untuk mempermudah pemanggilan gambar di Frontend
    public function getImageAttribute()
    {
        return $this->imageUrl ? asset('storage/' . $this->imageUrl) : null;
    }
}

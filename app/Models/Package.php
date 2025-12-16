<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// --- PERBAIKAN IMPORT ---
// Gunakan WeddingOrganizer karena data vendor tersimpan di tabel wedding_organizers
use App\Models\WeddingOrganizer;

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
        'price' => 'decimal:2', // Tambahan: Biar harga selalu format angka desimal
    ];

    /**
     * Relasi ke Pemilik Paket (Vendor/WeddingOrganizer)
     */
    public function vendor(): BelongsTo
    {
        // KUNCI PERBAIKAN:
        // Arahkan ke WeddingOrganizer::class, bukan Vendor::class.
        // Parameter 2 ('vendor_id') adalah nama kolom foreign key di tabel packages.
        return $this->belongsTo(WeddingOrganizer::class, 'vendor_id');
    }
}

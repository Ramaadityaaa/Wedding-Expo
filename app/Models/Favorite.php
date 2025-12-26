<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Favorite extends Model
{
    use HasFactory;

    protected $fillable = [
        'vendor_id',
        'user_id',
        'session_id',
    ];

    /**
     * Biar controller tetap enak dibaca (weddingOrganizer),
     * tapi FK-nya tetap vendor_id sesuai tabel favorites.
     */
    public function weddingOrganizer(): BelongsTo
    {
        return $this->belongsTo(WeddingOrganizer::class, 'vendor_id');
    }

    // optional: kalau masih ada kode lama manggil $favorite->vendor
    public function vendor(): BelongsTo
    {
        return $this->belongsTo(WeddingOrganizer::class, 'vendor_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

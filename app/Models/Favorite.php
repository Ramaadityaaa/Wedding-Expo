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
     * Relasi yang benar: favorite -> vendor (tabel vendors)
     */
    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class, 'vendor_id');
    }

    /**
     * Backward compatibility:
     * Kalau masih ada kode lama yang memanggil $favorite->weddingOrganizer,
     * tetap jalan tapi isinya Vendor.
     */
    public function weddingOrganizer(): BelongsTo
    {
        return $this->belongsTo(Vendor::class, 'vendor_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

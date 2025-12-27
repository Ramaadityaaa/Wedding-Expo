<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\User;
use App\Models\WeddingOrganizer;

class Review extends Model
{
    use HasFactory;

    // Status standar
    public const STATUS_PENDING  = 'PENDING';
    public const STATUS_APPROVED = 'APPROVED';
    public const STATUS_REJECTED = 'REJECTED';

    protected $fillable = [
        'user_id',
        'vendor_id',
        'rating',
        'comment',
        'reply',
        'status',
    ];

    /**
     * Relasi ke user (customer)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke vendor (konsisten dengan sistem vendor kamu: WeddingOrganizer)
     */
    public function vendor()
    {
        return $this->belongsTo(WeddingOrganizer::class, 'vendor_id');
    }

    /**
     * Alias biar kode lama yang masih pake weddingOrganizer ga error.
     */
    public function weddingOrganizer()
    {
        return $this->belongsTo(WeddingOrganizer::class, 'vendor_id');
    }
}

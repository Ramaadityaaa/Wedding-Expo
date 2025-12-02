<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'wedding_organizer_id',
        'user_id',
        'rating',
        'comment',
        'status' // <-- Ganti 'isApproved' dengan 'status'
    ];

    public function weddingOrganizer(): BelongsTo
    {
        return $this->belongsTo(WeddingOrganizer::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

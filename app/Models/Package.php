<?php

// app/Models/Package.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Package extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'wedding_organizer_id', 'name', 'description', 'price', 
        'duration', 'includes', 'isPublished',
    ];

    public function weddingOrganizer(): BelongsTo
    {
        return $this->belongsTo(WeddingOrganizer::class);
    }
}
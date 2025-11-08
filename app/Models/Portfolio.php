<?php

// app/Models/Portfolio.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Portfolio extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'wedding_organizer_id', 'title', 'description', 'imageUrl', 
        'videoUrl', 'isPublished',
    ];

    public function weddingOrganizer(): BelongsTo
    {
        return $this->belongsTo(WeddingOrganizer::class);
    }
}   

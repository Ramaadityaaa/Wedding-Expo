<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Portfolio extends Model
{
    use HasFactory;

    protected $fillable = [
        'vendor_id',
        'package_id',     // ✅ WAJIB
        'title',
        'description',
        'imageUrl',
        'videoUrl',
        'isPublished',
    ];
    public function getImageAttribute()
    {
        return $this->imageUrl ? asset('storage/' . $this->imageUrl) : null;
    }
}

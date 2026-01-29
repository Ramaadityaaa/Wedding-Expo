<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
        'image_url',
    ];

    protected $casts = [
        'features' => 'array',
        'price' => 'decimal:2',
    ];

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class, 'vendor_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(PackageImage::class, 'package_id');
    }
}

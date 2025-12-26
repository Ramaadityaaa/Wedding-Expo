<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PackageImage extends Model
{
    protected $table = 'package_images';

    protected $fillable = [
        'package_id',
        'path',
        'sort_order',
        'is_published',
    ];

    public function package()
    {
        return $this->belongsTo(Package::class);
    }
}

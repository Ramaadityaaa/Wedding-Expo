<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\User;
use App\Models\Vendor;

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
     * Relasi ke vendor (TABEL: vendors)
     */
    public function vendor()
    {
        return $this->belongsTo(Vendor::class, 'vendor_id');
    }

    /**
     * Alias untuk backward compatibility:
     * Jika masih ada kode lama yang memanggil weddingOrganizer(),
     * tetap akan mengembalikan Vendor dari tabel vendors.
     */
    public function weddingOrganizer()
    {
        return $this->belongsTo(Vendor::class, 'vendor_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne; // Perlu untuk relasi orderPayment

// ===============================================
// 🎯 PERBAIKAN Wajib: Import Model Relasi
// ===============================================
use App\Models\User;
use App\Models\Package; 
use App\Models\WeddingOrganizer; 
use App\Models\OrderPayment; 
// ===============================================

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'vendor_id',
        'package_id',
        'order_date',
        'status',
        'payment_status',
        'total_price',
        'amount',
        'snap_token',
        'user_id',
    ];

    protected $casts = [
        'order_date' => 'datetime',
        'amount' => 'decimal:2',
    ];

    // --- RELASI UTAMA ---

    /**
     * 1. Relasi ke Vendor (WeddingOrganizer)
     */
    public function vendor(): BelongsTo
    {
        return $this->belongsTo(WeddingOrganizer::class, 'vendor_id');
    }

    /**
     * 2. Relasi ke Package
     */
    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class, 'package_id');
    }

    /**
     * 3. Relasi ke Customer (User)
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }
    
    /**
     * 4. Relasi User (Alias dari Customer)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    /**
     * 5. Relasi Pembayaran
     * Menggunakan HasOne dan memastikan tipe return menggunakan HasOne
     */
    public function orderPayment(): HasOne
    {
        return $this->hasOne(OrderPayment::class)->latest();
    }
}
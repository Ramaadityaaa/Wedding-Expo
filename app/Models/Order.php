<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne; // Untuk relasi orderPayment

// ===============================================
// 🎯 Pastikan Import Model Relasi
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
        'customer_id', // Menggunakan customer_id sebagai penghubung dengan model User
        'vendor_id',
        'package_id',
        'order_date',
        'status',
        'payment_status',
        'total_price',
        'amount',
        'snap_token',  // Kolom ini tetap dipertahankan
    ];

    protected $casts = [
        'order_date' => 'datetime',  // Mengubah kolom order_date ke datetime
        'amount' => 'decimal:2',     // Mengatur amount agar menggunakan dua tempat desimal
    ];

    // --- RELASI UTAMA ---
    public function vendor(): BelongsTo
    {
        return $this->belongsTo(WeddingOrganizer::class, 'vendor_id');
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class, 'package_id');
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function orderPayment(): HasOne
    {
        return $this->hasOne(OrderPayment::class)->latest();  // Ambil pembayaran terakhir
    }
}

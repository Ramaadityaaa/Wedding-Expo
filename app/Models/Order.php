<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
        'amount', // TAMBAHAN PENTING: Controller menggunakan kolom 'amount'
        'snap_token' // Persiapan jika nanti pakai Midtrans
    ];

    // Casting agar tanggal otomatis jadi Carbon Object (enak diformat di frontend)
    protected $casts = [
        'order_date' => 'datetime',
        'amount' => 'decimal:2',
    ];

    // --- RELASI UTAMA ---

    /**
     * 1. Relasi ke Vendor
     * PERBAIKAN: Arahkan ke WeddingOrganizer karena tabel 'packages' 
     * terhubung ke 'wedding_organizers' di database.
     */
    public function vendor(): BelongsTo
    {
        // Pastikan pakai WeddingOrganizer::class, bukan Vendor::class
        // Kecuali Anda sudah migrasi total datanya ke tabel 'vendors'
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

    // Relasi User (Alias dari Customer, kadang dipanggil user())
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }
}

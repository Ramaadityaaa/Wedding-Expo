<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentProof extends Model
{
    use HasFactory;

    protected $table = 'payment_proofs';

    // Kolom yang boleh diisi
    protected $fillable = [
        'vendor_id',
        'account_name',
        'amount',
        'file_path',
        'status',
    ];

    // Cast tipe data
    protected $casts = [
        'amount' => 'integer',
    ];

    /**
     * Relasi ke Vendor
     * 1 bukti pembayaran dimiliki oleh 1 vendor
     */
    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    /**
     * Accessor untuk URL file bukti pembayaran
     * Menghasilkan URL lengkap dari file_path
     */
    public function getFileUrlAttribute()
    {
        if (!$this->file_path) return null;

        // Jika pakai storage link
        return asset('storage/' . $this->file_path);
    }
}

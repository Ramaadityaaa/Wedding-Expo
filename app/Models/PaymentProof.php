<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentProof extends Model
{
    use HasFactory;

    protected $table = 'payment_proofs';

    protected $fillable = [
        'vendor_id',
        'invoice_id',   // <--- WAJIB ADA agar tidak error Mass Assignment
        'account_name',
        'amount',
        'file_path',
        'status',
    ];

    protected $casts = [
        'amount' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relasi ke Vendor.
     * Menggunakan model Vendor::class karena sistem pembayaran baru
     * menyimpan data ke tabel 'vendors'.
     */
    public function vendor()
    {
        return $this->belongsTo(Vendor::class, 'vendor_id');
    }

    /**
     * Relasi ke Invoice.
     * Menambahkan ini untuk memperbaiki error "Call to undefined relationship [invoice]"
     */
    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    /**
     * Accessor untuk URL file bukti pembayaran
     */
    public function getFileUrlAttribute()
    {
        if (!$this->file_path) return null;

        return asset('storage/' . $this->file_path);
    }
}

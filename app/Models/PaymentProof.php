<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class PaymentProof extends Model
{
    use HasFactory;

    protected $table = 'payment_proofs';

    protected $fillable = [
        'vendor_id',
        'invoice_id',   
        'account_name',
        'amount',
        'file_path',
        'status',
    ];

    /**
     * Menambahkan atribut custom ke dalam array/JSON model secara otomatis.
     * Ini penting agar 'file_url' muncul di response Inertia/React.
     */
    protected $appends = ['file_url'];

    protected $casts = [
        'amount' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relasi ke Vendor.
     * Memastikan admin bisa mengambil data vendor terkait.
     */
    public function vendor()
    {
        return $this->belongsTo(Vendor::class, 'vendor_id');
    }

    /**
     * Relasi ke Invoice.
     * Menggunakan foreign key default 'invoice_id'.
     */
    public function invoice()
    {
        return $this->belongsTo(Invoice::class, 'invoice_id');
    }

    /**
     * Accessor untuk URL file bukti pembayaran.
     * Di React, Anda bisa mengaksesnya dengan: data.file_url
     */
    public function getFileUrlAttribute()
    {
        // Pastikan file_path ada dan file tersebut ada di storage
        if (!$this->file_path || !Storage::disk('public')->exists($this->file_path)) {
            return null;
        }

        // Kembalikan URL file
        return asset('storage/' . $this->file_path);
    }
}

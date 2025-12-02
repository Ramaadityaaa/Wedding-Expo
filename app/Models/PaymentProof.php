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
     * Relasi ke Vendor (WeddingOrganizer).
     * Diubah ke WeddingOrganizer::class karena modul Admin Vendor menggunakan model tersebut.
     */
    public function vendor()
    {
        // Pastikan foreign key di tabel payment_proofs adalah 'vendor_id'
        // dan mengarah ke id di tabel wedding_organizers
        return $this->belongsTo(WeddingOrganizer::class, 'vendor_id');
    }

    /**
     * Accessor untuk URL file bukti pembayaran
     */
    public function getFileUrlAttribute()
    {
        if (!$this->file_path) return null;

        // Menggunakan helper 'storage_path' atau asset storage
        return asset('storage/' . $this->file_path);
    }
}

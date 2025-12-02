<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentSetting extends Model
{
    use HasFactory;

    protected $table = 'payment_settings';

    protected $fillable = [
        'bank_name',
        'bank_number',
        'account_holder',
        'qris_path',
        'is_active',
    ];

    /**
     * Helper untuk mendapatkan URL QRIS lengkap
     */
    public function getQrisUrlAttribute()
    {
        if (!$this->qris_path) return null;
        return asset('storage/' . $this->qris_path);
    }

    /**
     * Helper untuk format string "Nomor - Bank"
     */
    public function getFullAccountAttribute()
    {
        return "{$this->bank_number} - {$this->bank_name} ({$this->account_holder})";
    }
}

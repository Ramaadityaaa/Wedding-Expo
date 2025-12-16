<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'bank_source',
        'account_name',
        'account_number',
        'amount',
        'proof_file',
        'status',
        'rejection_note'
    ];

    // Relasi balik ke Order
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}

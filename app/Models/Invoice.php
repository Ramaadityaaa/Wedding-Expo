<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'vendor_id',
        'invoice_number',
        'plan_id',
        'amount',
        'status', // PENDING, PAID, CANCELLED
        'due_date',
    ];

    protected $casts = [
        'amount' => 'integer',
        'due_date' => 'date',
    ];

    public function vendor()
    {
        return $this->belongsTo(WeddingOrganizer::class, 'vendor_id');
    }
}

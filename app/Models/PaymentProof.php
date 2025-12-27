<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class PaymentProof extends Model
{
    use HasFactory;

    public const STATUS_PENDING  = 'Pending';
    public const STATUS_APPROVED = 'Approved';
    public const STATUS_REJECTED = 'Rejected';

    protected $table = 'payment_proofs';

    protected $fillable = [
        'vendor_id',
        'invoice_id',
        'account_name',
        'amount',
        'file_path',
        'status',
    ];

    protected $appends = ['file_url'];

    protected $casts = [
        'amount' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class, 'vendor_id');
    }

    public function invoice()
    {
        return $this->belongsTo(Invoice::class, 'invoice_id');
    }

    public function getFileUrlAttribute()
    {
        if (!$this->file_path) {
            return null;
        }

        if (!Storage::disk('public')->exists($this->file_path)) {
            return null;
        }

        return asset('storage/' . $this->file_path);
    }
}

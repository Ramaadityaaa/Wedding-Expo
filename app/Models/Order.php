<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id', 'vendor_id', 'package_id', 'order_date', 'status', 'payment_status'
    ];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }
}

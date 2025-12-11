<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    // Tambahkan casting untuk kolom waktu jika ada (misalnya created_at, updated_at)
    // Walaupun 'order_date' ada, biarkan Laravel yang handle tanggal lain.

    protected $fillable = [
        'customer_id', 'vendor_id', 'package_id', 'order_date', 'status', 'payment_status', 'total_price' // Tambah 'total_price' jika ada
    ];

    // Kolom relasi harus selalu ada di Model Order
    // ===============================================

    // 1. Relasi ke Vendor (Direct Relation - Jika Anda ingin langsung dari Order)
    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    // 2. Relasi ke Package (Crucial Relation)
    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    // 3. Relasi ke Customer
    public function customer()
    {
        // Pastikan Anda menunjuk kolom kunci asing yang benar ('customer_id')
        return $this->belongsTo(User::class, 'customer_id');
    }
    
    // ===============================================
    // RELASI TAMBAHAN (Akses Vendor melalui Package)
    // Relasi 'vendorViaPackage' ini berguna jika Anda tahu Order dibuat berdasarkan Package, dan Package punya Vendor.
    // Relasi ini memastikan bahwa saat Anda load Order->package, Anda juga bisa load Package->vendor.
    public function vendorViaPackage()
    {
        return $this->hasOneThrough(
            Vendor::class, // Model akhir yang ingin dicapai
            Package::class, // Model perantara
            'id',           // Foreign key di tabel Package (kunci utama package)
            'id',           // Foreign key di tabel Vendor (kunci utama vendor)
            'package_id',   // Local key di tabel Order
            'vendor_id'     // Local key di tabel Package
        );
    }

}
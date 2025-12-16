<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Tambahkan kolom untuk menyimpan total harga
            // Gunakan decimal agar bisa menyimpan nilai koma, atau bigInteger jika Anda menyimpan dalam satuan terkecil (sen/rupiah)
            $table->decimal('total_price', 15, 2)->after('package_id')->nullable(); 
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('total_price');
        });
    }
};
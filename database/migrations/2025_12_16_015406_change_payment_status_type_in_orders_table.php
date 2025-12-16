<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Ubah kolom payment_status menjadi VARCHAR(255) agar bisa menerima 'REJECTED', 'CANCELLED', dll.
        DB::statement("ALTER TABLE orders MODIFY COLUMN payment_status VARCHAR(255) DEFAULT 'PENDING'");

        // Opsional: Lakukan hal yang sama untuk kolom 'status' utama order jika itu juga ENUM
        DB::statement("ALTER TABLE orders MODIFY COLUMN status VARCHAR(255) DEFAULT 'PENDING'");
    }

    public function down(): void
    {
        // Kembalikan ke ENUM jika rollback (sesuaikan dengan enum awal kamu jika ingat)
        // Ini contoh saja, tidak wajib dijalankan
        DB::statement("ALTER TABLE orders MODIFY COLUMN payment_status ENUM('PENDING', 'PAID') DEFAULT 'PENDING'");
    }
};

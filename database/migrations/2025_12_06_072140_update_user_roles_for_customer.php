<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // PENTING: Kita ubah kolom 'role' dari ENUM yang kaku menjadi string.
        // Ini mengatasi semua masalah truncation/invalid value.
        Schema::table('users', function (Blueprint $table) {
            // Ubah tipe kolom role menjadi string (VARCHAR) dengan panjang 20
            // dan set default yang aman.
            $table->string('role', 20)->default('CUSTOMER')->change();
        });

        // Opsional: Jika Anda menggunakan status 'VISITOR' untuk user lama
        // DB::statement("UPDATE users SET role = 'CUSTOMER' WHERE role = 'VISITOR'");
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Saat rollback, kembalikan ke ENUM asli yang Anda definisikan (opsional)
            // Namun, untuk rollback yang aman, biarkan field diubah kembali ke ENUM yang valid jika diperlukan.
            $table->string('role', 20)->default('VISITOR')->change();
        });
    }
};

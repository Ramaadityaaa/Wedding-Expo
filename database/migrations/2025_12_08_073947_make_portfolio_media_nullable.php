<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('portfolios', function (Blueprint $table) {
            // Ubah kolom imageUrl dan videoUrl menjadi boleh kosong (NULL)
            $table->string('imageUrl')->nullable()->change();
            $table->string('videoUrl')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('portfolios', function (Blueprint $table) {
            // Kembalikan ke pengaturan awal (tidak boleh kosong) - Hati-hati ini bisa error jika ada data null
            // Sebaiknya di production tidak perlu di-reverse ke strict mode
            // $table->string('imageUrl')->nullable(false)->change();
        });
    }
};

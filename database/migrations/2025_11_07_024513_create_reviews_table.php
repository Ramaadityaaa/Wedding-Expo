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
        // Hapus tabel lama jika ada agar tidak error "Table exists"
        Schema::dropIfExists('reviews');

        Schema::create('reviews', function (Blueprint $table) {
            $table->id();

            // Relasi ke Customer (User)
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // Relasi ke Vendor (Sistem Baru)
            $table->foreignId('vendor_id')->constrained('vendors')->onDelete('cascade');

            // Konten Review
            $table->integer('rating'); // 1 sampai 5
            $table->text('comment')->nullable();

            // Kolom Balasan Vendor (Baru)
            $table->text('reply')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('reviews');

        Schema::create('reviews', function (Blueprint $table) {
            $table->id();

            // Relasi ke Customer (User)
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // PERBAIKAN FATAL DI SINI:
            // Jangan constrained('vendors'), tapi constrained('wedding_organizers')
            $table->foreignId('vendor_id')
                ->constrained('wedding_organizers')
                ->onDelete('cascade');

            // Konten Review
            $table->integer('rating'); // 1 sampai 5
            $table->text('comment')->nullable();

            // Kolom Balasan Vendor
            $table->text('reply')->nullable();

            // Tambahan kolom status (agar Admin Dashboard tidak error saat menghitung pending reviews)
            $table->string('status')->default('PENDING'); // PENDING, APPROVED, REJECTED

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};

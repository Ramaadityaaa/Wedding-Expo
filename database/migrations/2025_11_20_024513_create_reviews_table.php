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

            // PERBAIKAN: Harus ke 'vendors'
            $table->foreignId('vendor_id')
                ->constrained('vendors') // <--- INI WAJIB 'vendors'
                ->onDelete('cascade');

            $table->integer('rating'); // 1 sampai 5
            $table->text('comment')->nullable();
            $table->text('reply')->nullable();
            $table->string('status')->default('PENDING');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};

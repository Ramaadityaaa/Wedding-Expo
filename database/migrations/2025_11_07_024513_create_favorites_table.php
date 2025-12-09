<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Drop dulu untuk memastikan bersih
        Schema::dropIfExists('favorites');

        Schema::create('favorites', function (Blueprint $table) {
            $table->id();

            // PERBAIKAN: Ubah jadi vendor_id agar konsisten dengan tabel lain
            // Tetap mengarah ke tabel 'wedding_organizers'
            $table->foreignId('vendor_id')
                ->constrained('wedding_organizers')
                ->onDelete('cascade');

            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');

            $table->string('session_id')->nullable(); // Untuk non-logged in users
            $table->timestamps();

            // Update Unique Constraints menggunakan vendor_id
            $table->unique(['vendor_id', 'user_id']);
            $table->unique(['vendor_id', 'session_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
};

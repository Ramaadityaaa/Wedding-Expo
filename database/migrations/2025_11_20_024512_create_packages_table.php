<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Hapus tabel jika ada (agar bersih)
        Schema::dropIfExists('packages');

        Schema::create('packages', function (Blueprint $table) {
            $table->id();

            // PERBAIKAN: Ubah ke 'vendors'
            $table->foreignId('vendor_id')
                ->constrained('vendors') // <--- GANTI INI
                ->onDelete('cascade');

            $table->string('name');
            $table->decimal('price', 15, 2);
            $table->text('description')->nullable();
            $table->json('features')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};

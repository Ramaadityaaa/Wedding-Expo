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
        // 1. HAPUS TABEL LAMA (PENTING AGAR TIDAK KONFLIK)
        Schema::dropIfExists('packages');

        // 2. BUAT TABEL BARU DENGAN STRUKTUR VENDOR
        Schema::create('packages', function (Blueprint $table) {
            $table->id();

            // Relasi ke tabel 'vendors' (bukan wedding_organizers lagi)
            $table->foreignId('vendor_id')->constrained('vendors')->onDelete('cascade');

            $table->string('name');             // Nama Paket
            $table->decimal('price', 15, 2);    // Harga (Decimal agar akurat)
            $table->text('description')->nullable();

            // Fitur disimpan dalam JSON agar fleksibel (array)
            $table->json('features')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};

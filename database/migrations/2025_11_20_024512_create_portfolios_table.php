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
        // 1. Drop tabel jika ada (Clean slate)
        Schema::dropIfExists('portfolios');

        Schema::create('portfolios', function (Blueprint $table) {
            $table->id();

            // PERBAIKAN:
            // 1. Arahkan constrained ke 'vendors'
            // 2. Pastikan file ini sudah di-rename tanggalnya jadi lebih baru dari migrasi vendors
            $table->foreignId('vendor_id')
                ->constrained('vendors') // <--- GANTI INI
                ->onDelete('cascade');

            $table->string('title')->nullable();
            $table->text('description')->nullable();

            // Opsional: Tambahkan nullable pada imageUrl jika ada kasus upload gagal tapi record terbuat
            // Tapi kalau wajib ada gambar, biarkan string saja.
            $table->string('imageUrl')->nullable();

            $table->string('videoUrl')->nullable();

            // Opsional: Tambahkan package_id jika portofolio terikat paket (sesuai controller kamu tadi)
            $table->foreignId('package_id')->nullable()->constrained('packages')->onDelete('set null');

            $table->boolean('isPublished')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('portfolios');
    }
};

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
            // 1. HAPUS FOREIGN KEY DULU (PENTING!)
            // Kita gunakan nama constraint yang muncul di error log Anda
            try {
                $table->dropForeign('portfolios_wedding_organizer_id_foreign');
            } catch (\Exception $e) {
                // Abaikan jika foreign key sudah tidak ada (untuk safety)
            }

            // 2. HAPUS KOLOM LAMA
            if (Schema::hasColumn('portfolios', 'wedding_organizer_id')) {
                $table->dropColumn('wedding_organizer_id');
            }

            // 3. TAMBAH KOLOM BARU (VENDOR_ID)
            if (!Schema::hasColumn('portfolios', 'vendor_id')) {
                $table->foreignId('vendor_id')
                    ->after('id') // Taruh setelah ID
                    ->constrained('vendors') // Sambung ke tabel vendors
                    ->onDelete('cascade');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('portfolios', function (Blueprint $table) {
            // Rollback: Hapus vendor_id, kembalikan wedding_organizer_id
            if (Schema::hasColumn('portfolios', 'vendor_id')) {
                $table->dropForeign(['vendor_id']);
                $table->dropColumn('vendor_id');
            }

            if (!Schema::hasColumn('portfolios', 'wedding_organizer_id')) {
                $table->unsignedBigInteger('wedding_organizer_id')->nullable();
                // Note: Kita tidak pasang foreign key balik di down() untuk menghindari kompleksitas error jika tabel lama sudah hilang
            }
        });
    }
};

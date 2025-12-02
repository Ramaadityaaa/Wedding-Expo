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
        Schema::table('reviews', function (Blueprint $table) {
            // 1. Tambahkan kolom status baru
            $table->enum('status', ['PENDING', 'APPROVED', 'REJECTED'])
                ->default('PENDING')
                ->after('comment');

            // 2. (Opsional) Hapus kolom isApproved lama jika tidak dipakai lagi
            // $table->dropColumn('isApproved'); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropColumn('status');
            // $table->boolean('isApproved')->default(false); // Kembalikan jika rollback
        });
    }
};

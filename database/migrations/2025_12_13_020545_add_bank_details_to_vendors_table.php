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
        // Asumsi tabel yang benar adalah 'vendors'
        Schema::table('vendors', function (Blueprint $table) {
<<<<<<< Updated upstream
            // HAPUS ->after('...') biar aman dan tidak error kolom tidak ditemukan
            $table->string('bank_name')->nullable();
            $table->string('account_number')->nullable();
            $table->string('account_holder_name')->nullable();
=======
            
            // Perbaikan Wajib: Tambahkan kolom baru setelah kolom yang pasti ada ('status')
            $table->string('bank_name')->nullable()->after('status');
            $table->string('account_number')->nullable()->after('bank_name');
            $table->string('account_holder_name')->nullable()->after('account_number');
            
            // Tambahkan kolom untuk QRIS Image Path yang Anda butuhkan
            $table->string('qris_image_path')->nullable()->after('account_holder_name');
>>>>>>> Stashed changes
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vendors', function (Blueprint $table) {
            $table->dropColumn(['bank_name', 'account_number', 'account_holder_name', 'qris_image_path']);
        });
    }
};

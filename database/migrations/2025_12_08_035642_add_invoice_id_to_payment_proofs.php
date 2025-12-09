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
        Schema::table('payment_proofs', function (Blueprint $table) {
            // Tambahkan kolom invoice_id setelah vendor_id
            if (!Schema::hasColumn('payment_proofs', 'invoice_id')) {
                $table->foreignId('invoice_id')
                    ->after('vendor_id')
                    ->constrained('invoices')
                    ->onDelete('cascade'); // Jika invoice dihapus, bukti bayar ikut terhapus
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payment_proofs', function (Blueprint $table) {
            // Hapus foreign key dan kolomnya jika rollback
            $table->dropForeign(['invoice_id']);
            $table->dropColumn('invoice_id');
        });
    }
};

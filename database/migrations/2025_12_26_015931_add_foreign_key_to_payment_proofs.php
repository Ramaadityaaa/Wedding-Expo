<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('payment_proofs', function (Blueprint $table) {
            // Menambahkan foreign key constraint
            $table->foreign('vendor_id')
                ->references('id')
                ->on('vendors')
                ->onDelete('cascade'); // Jika vendor dihapus, bukti pembayaran juga akan dihapus
        });
    }

    public function down()
    {
        Schema::table('payment_proofs', function (Blueprint $table) {
            // Menghapus foreign key constraint jika migrasi di-rollback
            $table->dropForeign(['vendor_id']);
        });
    }
};

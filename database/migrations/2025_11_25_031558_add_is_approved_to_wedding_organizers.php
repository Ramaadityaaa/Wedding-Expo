<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIsApprovedToWeddingOrganizers extends Migration
{
    /**
     * Menjalankan migrasi untuk menambahkan kolom isApproved.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('wedding_organizers', function (Blueprint $table) {
            // Menambahkan kolom isApproved dengan default false
            $table->enum('isApproved', ['PENDING', 'APPROVED', 'REJECTED'])->default('PENDING');
        });
    }

    /**
     * Membalikkan migrasi dengan menghapus kolom isApproved.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('wedding_organizers', function (Blueprint $table) {
            // Menghapus kolom isApproved
            $table->dropColumn('isApproved');
        });
    }
}

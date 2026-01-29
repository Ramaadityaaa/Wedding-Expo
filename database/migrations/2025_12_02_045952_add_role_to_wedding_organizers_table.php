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
        Schema::table('wedding_organizers', function (Blueprint $table) {
            // HAPUS bagian ->after('isApproved')
            // Biarkan kolom role masuk di urutan terakhir
            $table->string('role')->default('Vendor');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('wedding_organizers', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }
};

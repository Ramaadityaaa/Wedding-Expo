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
            // Menambahkan kolom role dengan default 'Vendor'
            // Kita letakkan setelah kolom 'isApproved' biar rapi
            $table->string('role')->default('Vendor')->after('isApproved');
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

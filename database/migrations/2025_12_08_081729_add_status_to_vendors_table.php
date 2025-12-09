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
        Schema::table('vendors', function (Blueprint $table) {
            // Tambahkan kolom status dengan default 'pending'
            // Letakkan setelah kolom 'description' (opsional)
            if (!Schema::hasColumn('vendors', 'status')) {
                $table->string('status')->default('pending')->after('description');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vendors', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};

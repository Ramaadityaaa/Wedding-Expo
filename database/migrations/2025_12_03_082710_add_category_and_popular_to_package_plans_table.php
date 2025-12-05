<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('package_plans', function (Blueprint $table) {
            // Kolom untuk jenis paket (misal: Ultima, Standard, Basic)
            $table->enum('category', ['BASIC', 'STANDARD', 'ULTIMA'])->default('BASIC')->after('duration_days');

            // Kolom untuk penanda populer/unggulan
            $table->boolean('is_popular')->default(false)->after('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('package_plans', function (Blueprint $table) {
            //
        });
    }
};

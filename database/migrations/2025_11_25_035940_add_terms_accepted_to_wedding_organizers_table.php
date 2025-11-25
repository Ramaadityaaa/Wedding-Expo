<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('wedding_organizers', function (Blueprint $table) {
            // Tambahkan kolom terms_accepted (default boolean false)
            $table->boolean('terms_accepted')->default(false)->after('isApproved'); 
        });
    }

    public function down(): void
    {
        Schema::table('wedding_organizers', function (Blueprint $table) {
            $table->dropColumn('terms_accepted');
        });
    }
};
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            // Tambahkan kolom status dengan default 'PENDING'
            // Agar Admin Dashboard bisa mendeteksinya
            if (!Schema::hasColumn('reviews', 'status')) {
                $table->string('status')->default('PENDING')->after('reply'); 
                // Opsinya: 'PENDING', 'APPROVED', 'REJECTED'
            }
        });
    }

    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Pastikan nama tabelnya benar. 
        // Jika di database kamu namanya 'vendors', ganti 'wedding_organizers' jadi 'vendors'
        Schema::table('wedding_organizers', function (Blueprint $table) {

            // HAPUS ->after('account_holder_name')
            // Biarkan nullable() saja agar tidak error
            $table->string('qris_path')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('wedding_organizers', function (Blueprint $table) {
            $table->dropColumn('qris_path');
        });
    }
};

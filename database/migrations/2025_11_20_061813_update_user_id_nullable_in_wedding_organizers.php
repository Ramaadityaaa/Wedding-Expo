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
            // Hapus foreign key lama
            $table->dropForeign(['user_id']);

            // Hapus unique constraint dari user_id
            $table->dropUnique(['user_id']);

            // Ubah menjadi nullable
            $table->foreignId('user_id')
                  ->nullable()
                  ->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('wedding_organizers', function (Blueprint $table) {
            // Kembalikan ke NOT NULL
            $table->foreignId('user_id')
                  ->nullable(false)
                  ->change();
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('wedding_organizers', function (Blueprint $table) {

            // Drop FK (jika ada)
            if (Schema::hasColumn('wedding_organizers', 'user_id')) {
                try { $table->dropForeign('wedding_organizers_user_id_foreign'); } catch (\Throwable $e) {}
            }

            // Drop Unique (jika ada)
            try { $table->dropUnique('wedding_organizers_user_id_unique'); } catch (\Throwable $e) {}

            // Ubah menjadi NULLABLE
            $table->unsignedBigInteger('user_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        // ❗❗ JANGAN dipaksa NOT NULL karena pasti error ❗❗
        Schema::table('wedding_organizers', function (Blueprint $table) {
            // Tidak melakukan apa-apa pada DOWN
        });
    }
};

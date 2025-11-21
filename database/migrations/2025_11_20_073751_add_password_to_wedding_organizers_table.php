<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('wedding_organizers', function (Blueprint $table) {

            // Tambah kolom password jika belum ada
            if (!Schema::hasColumn('wedding_organizers', 'password')) {
                $table->string('password')->nullable();

            }

            // Tambah kolom remember_token jika belum ada
            if (!Schema::hasColumn('wedding_organizers', 'remember_token')) {
                $table->rememberToken();
            }
        });
    }

    public function down(): void
    {
        Schema::table('wedding_organizers', function (Blueprint $table) {

            if (Schema::hasColumn('wedding_organizers', 'password')) {
                $table->dropColumn('password');
            }

            if (Schema::hasColumn('wedding_organizers', 'remember_token')) {
                $table->dropColumn('remember_token');
            }
        });
    }
};

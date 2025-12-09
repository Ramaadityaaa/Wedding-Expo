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
            // 1. Tambah user_id untuk relasi ke tabel users
            if (!Schema::hasColumn('vendors', 'user_id')) {
                $table->foreignId('user_id')
                    ->nullable() // Boleh null dulu untuk antisipasi
                    ->after('id')
                    ->constrained('users')
                    ->onDelete('cascade');
            }

            // 2. Tambah slug untuk URL cantik
            if (!Schema::hasColumn('vendors', 'slug')) {
                $table->string('slug')->nullable()->after('name');
            }

            // 3. Tambah description
            if (!Schema::hasColumn('vendors', 'description')) {
                $table->text('description')->nullable()->after('address');
            }

            // 4. Tambah Logo & Banner (jaga-jaga jika belum ada)
            if (!Schema::hasColumn('vendors', 'logo')) {
                $table->string('logo')->nullable()->after('description');
            }
            if (!Schema::hasColumn('vendors', 'banner')) {
                $table->string('banner')->nullable()->after('logo');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vendors', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn(['user_id', 'slug', 'description', 'logo', 'banner']);
        });
    }
};

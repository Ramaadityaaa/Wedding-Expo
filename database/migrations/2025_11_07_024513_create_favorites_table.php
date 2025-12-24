<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();

            // konsisten dengan tabel lain (packages, portfolios, reviews)
            // vendor_id di sini menunjuk ke wedding_organizers.id
            $table->foreignId('vendor_id')
                ->constrained('wedding_organizers')
                ->cascadeOnDelete();

            // favorit untuk user login
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->cascadeOnDelete();

            // favorit untuk guest (opsional kalau kamu pakai)
            $table->string('session_id')->nullable();

            $table->timestamps();

            // index untuk performa
            $table->index('user_id', 'favorites_user_idx');
            $table->index('session_id', 'favorites_session_idx');
            $table->index('vendor_id', 'favorites_vendor_idx');

            // cegah duplikat favorit:
            // 1) user login: 1 user hanya bisa favorite 1 vendor sekali
            $table->unique(['vendor_id', 'user_id'], 'favorites_vendor_user_unique');

            // 2) guest: 1 session hanya bisa favorite 1 vendor sekali
            $table->unique(['vendor_id', 'session_id'], 'favorites_vendor_session_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
};

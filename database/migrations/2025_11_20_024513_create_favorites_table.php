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

            // PERBAIKAN: Harus ke 'vendors'
            $table->foreignId('vendor_id')
                ->constrained('vendors') // <--- INI WAJIB 'vendors'
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('session_id')->nullable();
            $table->timestamps();

            $table->index('user_id', 'favorites_user_idx');
            $table->index('session_id', 'favorites_session_idx');
            $table->index('vendor_id', 'favorites_vendor_idx');

            $table->unique(['vendor_id', 'user_id'], 'favorites_vendor_user_unique');
            $table->unique(['vendor_id', 'session_id'], 'favorites_vendor_session_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
};

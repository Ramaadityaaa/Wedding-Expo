<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable(); // Dibuat nullable agar sesuai skema Prisma
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password'); // Dibuat non-nullable, karena Breeze akan mengelolanya

            // --- TAMBAHAN DARI PRISMA ---
            $table->enum('role', ['VISITOR', 'VENDOR', 'ADMIN'])->default('VISITOR');
            $table->string('phone')->nullable();
            // --- END TAMBAHAN ---

            $table->rememberToken();
            $table->timestamps(); // Ini akan membuat createdAt dan updatedAt
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};

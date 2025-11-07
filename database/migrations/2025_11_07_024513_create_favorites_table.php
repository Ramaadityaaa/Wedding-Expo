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
    Schema::create('favorites', function (Blueprint $table) {
        $table->id();
        
        // Relasi
        $table->foreignId('wedding_organizer_id')->constrained('wedding_organizers')->onDelete('cascade');
        $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
        
        $table->string('session_id')->nullable(); // Untuk non-logged in users
        $table->timestamps();
        
        // Unique constraints dari Prisma
        $table->unique(['wedding_organizer_id', 'user_id']);
        $table->unique(['wedding_organizer_id', 'session_id']);
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
};

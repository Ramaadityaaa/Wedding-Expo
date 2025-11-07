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
    Schema::create('packages', function (Blueprint $table) {
        $table->id();
        
        // Relasi ke WeddingOrganizer
        $table->foreignId('wedding_organizer_id')->constrained('wedding_organizers')->onDelete('cascade');
        
        $table->string('name');
        $table->text('description')->nullable();
        $table->integer('price');
        $table->string('duration')->nullable();
        $table->text('includes')->nullable(); // Dibuat text jika daftarnya panjang
        $table->boolean('isPublished')->default(false);
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};

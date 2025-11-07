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
    Schema::create('portfolios', function (Blueprint $table) {
        $table->id();
        
        // Relasi ke WeddingOrganizer
        $table->foreignId('wedding_organizer_id')->constrained('wedding_organizers')->onDelete('cascade');
        
        $table->string('title')->nullable();
        $table->text('description')->nullable();
        $table->string('imageUrl');
        $table->string('videoUrl')->nullable();
        $table->boolean('isPublished')->default(false);
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('portfolios');
    }
};

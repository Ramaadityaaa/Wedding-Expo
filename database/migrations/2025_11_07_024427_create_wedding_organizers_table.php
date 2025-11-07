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
    Schema::create('wedding_organizers', function (Blueprint $table) {
        $table->id();
        
        // Relasi ke User
        $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
        
        $table->string('name');
        $table->text('description')->nullable();
        $table->string('logo')->nullable();
        $table->string('coverPhoto')->nullable();
        $table->string('address')->nullable();
        $table->string('city')->nullable();
        $table->string('province')->nullable();
        $table->string('phone')->nullable();
        $table->string('whatsapp')->nullable();
        $table->string('email')->nullable();
        $table->string('website')->nullable();
        $table->string('instagram')->nullable();
        $table->string('facebook')->nullable();
        $table->boolean('isApproved')->default(false);
        $table->timestamps(); // createdAt dan updatedAt
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wedding_organizers');
    }
};

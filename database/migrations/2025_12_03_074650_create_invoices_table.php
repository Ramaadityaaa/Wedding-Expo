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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();

            // Relasi ke Vendor
            $table->foreignId('vendor_id')->constrained('wedding_organizers')->onDelete('cascade');

            $table->string('invoice_number')->unique();
            $table->string('plan_id'); // premium, basic, dll.
            $table->unsignedBigInteger('amount'); // Nominal harga
            $table->enum('status', ['PENDING', 'PAID', 'CANCELLED'])->default('PENDING');
            $table->timestamp('due_date')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};

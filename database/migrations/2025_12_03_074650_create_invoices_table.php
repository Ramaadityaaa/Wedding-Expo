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

            // PERBAIKAN: Ubah ke tabel 'vendors'
            $table->foreignId('vendor_id')->constrained('vendors')->onDelete('cascade');

            $table->string('invoice_number')->unique();
            $table->string('plan_id'); // premium, basic, dll.

            // SARAN: Gunakan decimal untuk uang agar koma/persen pajak tersimpan akurat
            // (Sebelumnya unsignedBigInteger, saya ubah ke decimal agar aman)
            $table->decimal('amount', 15, 2);

            $table->enum('status', ['PENDING', 'PAID', 'CANCELLED', 'REJECTED'])->default('PENDING'); // Tambahkan REJECTED jaga-jaga
            $table->timestamp('due_date')->nullable();
            $table->timestamp('paid_at')->nullable(); // Tambahkan ini untuk mencatat kapan lunas
            $table->string('payment_method')->nullable(); // Tambahkan ini biar lengkap

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

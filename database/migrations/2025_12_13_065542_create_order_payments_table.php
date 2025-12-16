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
        Schema::create('order_payments', function (Blueprint $table) {
            $table->id();

            // Relasi ke Order (Wajib)
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');

            // Informasi Pengirim (Dari Form Customer)
            $table->string('bank_source')->nullable(); // Nama Bank Pengirim (Opsional)
            $table->string('account_name');            // Nama Pemilik Rekening Pengirim
            $table->string('account_number')->nullable();

            // Detail Pembayaran
            $table->decimal('amount', 15, 2);
            $table->string('proof_file'); // Path gambar bukti transfer

            // Status Verifikasi
            $table->string('status')->default('PENDING'); // PENDING, PAID, REJECTED

            // Catatan (misal: "Foto buram")
            $table->text('rejection_note')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_payments');
    }
};

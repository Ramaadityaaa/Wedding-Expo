<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('vendors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // --- Identitas Dasar ---
            $table->string('name');
            $table->string('slug')->nullable();
            $table->text('description')->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('phone')->nullable();

            // --- Kontak Person ---
            $table->string('contact_name')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('role')->default('Vendor');

            // --- Status & Legalitas ---
            $table->string('permit_number')->nullable();
            $table->string('permit_image_path')->nullable();

            // ==========================================
            // PERBAIKAN DI SINI (UBAH KE STRING)
            // ==========================================
            $table->string('isApproved')->default('PENDING');
            // ==========================================

            $table->text('rejection_reason')->nullable();

            // --- Data Bank ---
            $table->string('bank_name')->nullable();
            $table->string('account_number')->nullable();
            $table->string('account_holder_name')->nullable();
            $table->string('qris_path')->nullable();

            // --- Aset Visual ---
            $table->string('logo')->nullable();
            $table->string('cover_photo')->nullable();
            $table->string('website')->nullable();
            $table->string('instagram')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vendors');
    }
};

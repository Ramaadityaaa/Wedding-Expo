<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // PASTIKAN NAMA TABELNYA 'wedding_organizers'
        Schema::table('wedding_organizers', function (Blueprint $table) {
            // Cek dulu biar gak error kalau kolomnya ternyata sudah ada (opsional tapi aman)
            if (!Schema::hasColumn('wedding_organizers', 'bank_name')) {
                $table->string('bank_name')->nullable();
            }
            if (!Schema::hasColumn('wedding_organizers', 'account_number')) {
                $table->string('account_number')->nullable();
            }
            if (!Schema::hasColumn('wedding_organizers', 'account_holder_name')) {
                $table->string('account_holder_name')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('wedding_organizers', function (Blueprint $table) {
            $table->dropColumn(['bank_name', 'account_number', 'account_holder_name']);
        });
    }
};

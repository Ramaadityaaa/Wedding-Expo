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
        Schema::table('vendors', function (Blueprint $table) {

            // Tambah kolom hanya kalau belum ada (biar aman dari Duplicate column)
            if (!Schema::hasColumn('vendors', 'bank_name')) {
                $table->string('bank_name')->nullable()->after('status');
            }

            if (!Schema::hasColumn('vendors', 'account_number')) {
                // kalau bank_name belum ada dan after-nya bikin error, kamu bisa hapus after()
                $table->string('account_number')->nullable()->after('bank_name');
            }

            if (!Schema::hasColumn('vendors', 'account_holder_name')) {
                $table->string('account_holder_name')->nullable()->after('account_number');
            }

            if (!Schema::hasColumn('vendors', 'qris_image_path')) {
                $table->string('qris_image_path')->nullable()->after('account_holder_name');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vendors', function (Blueprint $table) {

            // Drop kolom hanya kalau ada (biar aman)
            $cols = [];

            if (Schema::hasColumn('vendors', 'qris_image_path')) {
                $cols[] = 'qris_image_path';
            }
            if (Schema::hasColumn('vendors', 'account_holder_name')) {
                $cols[] = 'account_holder_name';
            }
            if (Schema::hasColumn('vendors', 'account_number')) {
                $cols[] = 'account_number';
            }
            if (Schema::hasColumn('vendors', 'bank_name')) {
                $cols[] = 'bank_name';
            }

            if (!empty($cols)) {
                $table->dropColumn($cols);
            }
        });
    }
};

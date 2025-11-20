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
        Schema::table('wedding_organizers', function (Blueprint $table) {

            // Tambah kolom TYPE
            if (!Schema::hasColumn('wedding_organizers', 'type')) {
                $table->string('type')->nullable()->after('name');
            }

            // Tambah kolom PERMIT NUMBER
            if (!Schema::hasColumn('wedding_organizers', 'permit_number')) {
                $table->string('permit_number')->nullable()->after('city');
            }

            // Tambah kolom PERMIT IMAGE
            if (!Schema::hasColumn('wedding_organizers', 'permit_image_path')) {
                $table->string('permit_image_path')->nullable()->after('permit_number');
            }

            // Kontak (yang dipakai waktu insert)
            if (!Schema::hasColumn('wedding_organizers', 'contact_name')) {
                $table->string('contact_name')->nullable()->after('facebook');
            }

            if (!Schema::hasColumn('wedding_organizers', 'contact_email')) {
                $table->string('contact_email')->nullable()->after('contact_name');
            }

            if (!Schema::hasColumn('wedding_organizers', 'contact_phone')) {
                $table->string('contact_phone')->nullable()->after('contact_email');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('wedding_organizers', function (Blueprint $table) {
            if (Schema::hasColumn('wedding_organizers', 'type')) {
                $table->dropColumn('type');
            }

            if (Schema::hasColumn('wedding_organizers', 'permit_number')) {
                $table->dropColumn('permit_number');
            }

            if (Schema::hasColumn('wedding_organizers', 'permit_image_path')) {
                $table->dropColumn('permit_image_path');
            }

            if (Schema::hasColumn('wedding_organizers', 'contact_name')) {
                $table->dropColumn('contact_name');
            }

            if (Schema::hasColumn('wedding_organizers', 'contact_email')) {
                $table->dropColumn('contact_email');
            }

            if (Schema::hasColumn('wedding_organizers', 'contact_phone')) {
                $table->dropColumn('contact_phone');
            }
        });
    }
};

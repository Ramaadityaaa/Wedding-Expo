<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('package_images', function (Blueprint $table) {
            $table->boolean('is_published')->default(true)->after('sort_order');
            $table->index(['package_id', 'is_published', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::table('package_images', function (Blueprint $table) {
            $table->dropIndex(['package_id', 'is_published', 'sort_order']);
            $table->dropColumn('is_published');
        });
    }
};

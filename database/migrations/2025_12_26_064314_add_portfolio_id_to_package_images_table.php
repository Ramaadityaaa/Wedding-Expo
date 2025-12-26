<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('package_images', function (Blueprint $table) {
            $table->unsignedBigInteger('portfolio_id')->nullable()->after('package_id');

            $table->foreign('portfolio_id')
                ->references('id')
                ->on('portfolios')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('package_images', function (Blueprint $table) {
            $table->dropForeign(['portfolio_id']);
            $table->dropColumn('portfolio_id');
        });
    }
};
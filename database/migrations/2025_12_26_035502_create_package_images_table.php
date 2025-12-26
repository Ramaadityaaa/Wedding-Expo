<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('package_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('package_id')->constrained('packages')->cascadeOnDelete();
            $table->string('path'); // path di storage/public
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['package_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('package_images');
    }
};

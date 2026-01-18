<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddOrderDateAndPackageIdToOrdersTable extends Migration
{
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            // Periksa apakah kolom 'order_date' sudah ada
            if (!Schema::hasColumn('orders', 'order_date')) {
                $table->date('order_date')->after('package_id');
            }
            // Periksa apakah kolom 'package_id' sudah ada
            if (!Schema::hasColumn('orders', 'package_id')) {
                $table->bigInteger('package_id')->unsigned()->after('vendor_id');
            }
        });
    }

    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('order_date');
            $table->dropColumn('package_id');
        });
    }
}


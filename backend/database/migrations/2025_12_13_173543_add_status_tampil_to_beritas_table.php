<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('beritas', function (Blueprint $table) {
            // Default FALSE artinya tidak langsung tampil
            $table->boolean('status_tampil')->default(false)->after('highlight');
        });
    }

    public function down()
    {
        Schema::table('beritas', function (Blueprint $table) {
            $table->dropColumn('status_tampil');
        });
    }
};

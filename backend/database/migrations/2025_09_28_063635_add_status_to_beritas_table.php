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
        $table->string('status')->default('draft');
    });
}

public function down()
{
    Schema::table('beritas', function (Blueprint $table) {
        $table->dropColumn('status');
    });
}

};

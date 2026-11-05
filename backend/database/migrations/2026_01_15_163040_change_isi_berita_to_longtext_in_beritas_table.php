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
        $table->longText('isi_berita')->change();
    });
}

public function down()
{
    Schema::table('beritas', function (Blueprint $table) {
        $table->text('isi_berita')->change();
    });
}
};

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
        // tipe data bisa disesuaikan.
        // Kalau tag disimpan sebagai array JSON, pakai json.
        $table->json('tags')->nullable();  
        // atau kalau cuma string yang dipisah koma:
        // $table->string('tags')->nullable();
    });
}

public function down()
{
    Schema::table('beritas', function (Blueprint $table) {
        $table->dropColumn('tags');
    });
}

};

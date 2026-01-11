<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBeritasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
       Schema::create('beritas', function (Blueprint $table) {
        $table->id();

        $table->string('judul');
        $table->string('slug')->unique();
        
        $table->text('isi_berita');
        $table->string('gambar')->nullable();
        $table->string('penulis');

        $table->date('tanggal_upload');
        $table->unsignedInteger('views')->default(0);

        $table->string('kategori')->nullable();
        $table->boolean('highlight')->default(false);
        $table->date('jadwal')->nullable();

        $table->text('tags')->nullable(); // lebih aman untuk banyak tag

        $table->timestamps();
    });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('beritas');
    }
}

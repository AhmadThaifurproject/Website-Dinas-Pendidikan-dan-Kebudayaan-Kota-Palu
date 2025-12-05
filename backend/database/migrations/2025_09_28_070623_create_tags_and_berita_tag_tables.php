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
    Schema::create('tags', function (Blueprint $table) {
        $table->id();
        $table->string('nama')->unique();
        $table->timestamps();
    });

    Schema::create('berita_tag', function (Blueprint $table) {
        $table->foreignId('berita_id')->constrained('beritas')->onDelete('cascade');
        $table->foreignId('tag_id')->constrained('tags')->onDelete('cascade');
        $table->primary(['berita_id','tag_id']); // supaya tidak ada duplikat
    });
}

};

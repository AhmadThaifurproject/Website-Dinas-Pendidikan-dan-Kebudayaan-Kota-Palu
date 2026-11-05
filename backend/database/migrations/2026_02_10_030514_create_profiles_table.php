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
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nama Pejabat
            $table->string('title'); // Jabatan Utama (Kepala Dinas, dll)
            $table->string('subtitle'); // Sub Jabatan (Pendidikan Dasar, dll)
            $table->string('image'); // Tempat menyimpan nama file gambar
            $table->json('description'); 
            // Membedakan kategori pimpinan dan kepala bidang
            $table->enum('category', ['pimpinan', 'bidang']); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};

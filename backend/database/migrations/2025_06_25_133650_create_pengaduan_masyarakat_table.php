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
    Schema::create('pengaduan_masyarakat', function (Blueprint $table) {
        $table->id();
        $table->string('nama');
        $table->string('kontak');
        $table->string('jenis_pemohon');
        $table->string('judul');
        $table->text('isi_laporan');
        $table->string('identitas_path')->nullable();
        $table->string('dokumen_organisasi_path')->nullable();
        $table->string('bukti_pendukung_path')->nullable();
        $table->string('status')->default('belum ditanggapi'); // atau "diproses", "selesai"
        $table->text('tanggapan')->nullable();
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengaduan_masyarakat');
    }
};

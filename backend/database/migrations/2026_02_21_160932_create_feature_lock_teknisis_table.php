<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Nama tabel otomatis menjadi 'feature_lock_teknisis'
        Schema::create('feature_lock_teknisis', function (Blueprint $table) {
            $table->id();
            $table->string('admin_id'); 
            $table->string('bidang');
            $table->string('layanan');
            $table->string('fitur_id');
            $table->boolean('is_locked')->default(false);
            $table->timestamps();
            
            // Nama index dibatasi agar tidak terlalu panjang
            $table->unique(['admin_id', 'bidang', 'layanan', 'fitur_id'], 'unique_fl_teknisi');
        });
    }

    public function down()
    {
        Schema::dropIfExists('feature_lock_teknisis');
    }
};
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
   public function up()
{
    Schema::create('layanan_contents', function (Blueprint $table) {
        $table->id();
        $table->string('bidang')->index();      // Kolom Baru
        $table->string('layanan_slug');         // Kolom Baru
        
        // Kombinasi Unik
        $table->unique(['bidang', 'layanan_slug']); 
        
        $table->json('content');
        $table->timestamps();
    });
}

public function down()
{
    Schema::dropIfExists('layanan_contents');
}
};

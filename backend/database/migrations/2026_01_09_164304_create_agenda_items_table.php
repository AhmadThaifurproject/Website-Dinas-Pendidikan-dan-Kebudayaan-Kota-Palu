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
    Schema::create('agenda_items', function (Blueprint $table) {
        $table->id();
        $table->string('type'); // 'main' atau 'grid'
        $table->string('title')->nullable();
        $table->text('description')->nullable();
        $table->string('caption_source')->default('auto'); // 'auto' / 'manual'
        $table->string('date_location')->nullable();
        $table->string('media_url')->nullable();
        $table->string('media_type')->default('image');
        $table->string('target_url')->nullable();
        $table->string('button_text')->nullable();
        $table->integer('sort_order')->default(0); // Untuk menjaga urutan
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agenda_items');
    }
};

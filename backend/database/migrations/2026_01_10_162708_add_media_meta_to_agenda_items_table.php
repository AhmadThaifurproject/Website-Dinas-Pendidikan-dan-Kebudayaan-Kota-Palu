<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('agenda_items', function (Blueprint $table) {
            // Menambahkan kolom JSON baru
            $table->json('media_meta')->nullable()->after('media_url');
        });
    }

    public function down()
    {
        Schema::table('agenda_items', function (Blueprint $table) {
            $table->dropColumn('media_meta');
        });
    }
};
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('feature_lock_teknisis', function (Blueprint $table) {
            // Menambahkan kolom 'catatan' bertipe text yang boleh kosong (nullable)
            $table->text('catatan')->nullable()->after('is_locked');
        });
    }

    public function down()
    {
        Schema::table('feature_lock_teknisis', function (Blueprint $table) {
            $table->dropColumn('catatan');
        });
    }
};
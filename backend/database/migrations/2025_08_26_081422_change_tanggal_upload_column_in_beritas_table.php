<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('beritas', function (Blueprint $table) {
            $table->date('tanggal_upload')->change();
        });
    }

    public function down(): void
    {
        Schema::table('beritas', function (Blueprint $table) {
            $table->dateTime('tanggal_upload')->change();
        });
    }
};

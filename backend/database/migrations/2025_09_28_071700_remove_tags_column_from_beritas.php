<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('beritas', function (Blueprint $table) {
            $table->dropColumn('tags');   // ✅ hanya baris ini yang menghapus kolom
        });
    }

    public function down(): void
    {
        Schema::table('beritas', function (Blueprint $table) {
            $table->longText('tags')->nullable()
                  ->check("json_valid(`tags`)"); // jika perlu bisa kembalikan seperti semula
        });
    }
};

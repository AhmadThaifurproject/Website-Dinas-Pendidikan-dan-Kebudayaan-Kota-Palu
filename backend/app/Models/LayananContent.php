<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LayananContent extends Model
{
    use HasFactory;

    // Izinkan kolom ini diisi secara massal
    protected $fillable = [
        'bidang',        // Ganti layanan_key jadi ini
        'layanan_slug',  // Ganti layanan_key jadi ini
        'content',
    ];

    // Konversi otomatis: JSON di Database <-> Array di PHP
    protected $casts = [
        'content' => 'array',
    ];
}
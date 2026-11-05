<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;

    // Tentukan kolom mana saja yang boleh diisi secara massal
    protected $fillable = [
        'name', 
        'title', 
        'subtitle', 
        'image', 
        'description', 
        'category'
    ];

    /**
     * Fitur Casting:
     * Ini akan membuat kolom 'description' otomatis menjadi Array 
     * setiap kali kita memanggil data dari database. 
     * Jadi React tidak perlu melakukan JSON.parse lagi.
     */
    protected $casts = [
        'description' => 'array',
    ];
}

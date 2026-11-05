<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kalender extends Model
{
    protected $table = 'kalenders'; // Pastikan nama tabel sesuai
    protected $fillable = [
        'title', 
        'description', 
        'date', 
        'color', 
        'location', 
        'category', 
        'image'
    ];
}
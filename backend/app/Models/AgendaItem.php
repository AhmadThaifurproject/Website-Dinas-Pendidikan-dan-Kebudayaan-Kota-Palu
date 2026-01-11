<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AgendaItem extends Model
{
    use HasFactory;

    /**
     * KUNCI PERBAIKAN:
     * Menggunakan array kosong [] artinya kita menonaktifkan proteksi Mass Assignment.
     * Semua data yang dikirim dari Controller diizinkan masuk ke database.
     * Ini akan mengatasi error 500 akibat field yang lupa didaftarkan di $fillable.
     */
    protected $guarded = []; 
}
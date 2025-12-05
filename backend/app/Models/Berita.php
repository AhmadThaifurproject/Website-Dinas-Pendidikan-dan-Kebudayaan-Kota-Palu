<?php
namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;

class Berita extends Model
{
    protected $fillable = [
        'judul', 'slug', 'isi_berita', 'penulis', 'gambar',
        'tanggal_upload', 'views', 'highlight', 
        'kategori', 'status', 'tags', 'jadwal'
    ];

    protected $dates = ['tanggal_upload'];

    protected static function booted()
    {
        // Auto slug saat CREATE
        static::creating(function ($berita) {
            if (empty($berita->slug)) {
                $berita->slug = Str::slug($berita->judul);
            }
        });

        // Auto slug saat UPDATE *hanya jika judul berubah*
        static::updating(function ($berita) {
            if ($berita->isDirty('judul')) {
                $berita->slug = Str::slug($berita->judul);
            }
        });
    }
      public function tags()
{
    return $this->belongsToMany(Tag::class);
}
}



  


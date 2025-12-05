<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PengaduanMasyarakat extends Model
{
     protected $fillable = [
        'nama', 'kontak', 'jenis_pemohon', 'judul', 'isi_laporan',
        'identitas_path', 'dokumen_organisasi_path', 'bukti_pendukung_path',
        'status', 'tanggapan'
    ];

    protected $table = 'pengaduan_masyarakat';
}

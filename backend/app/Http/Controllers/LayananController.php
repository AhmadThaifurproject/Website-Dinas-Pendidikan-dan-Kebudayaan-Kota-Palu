<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LayananContent; 

class LayananController extends Controller
{
    /**
     * Menyimpan atau Update Konten Layanan
     * Route: POST /api/content/{bidang}/{layanan}
     */
    public function store(Request $request, $bidang, $layanan) {
        // 1. Buat Unique Key (contoh: 'sd_bos')
        $uniqueKey = strtolower($bidang) . '_' . strtolower($layanan);

        // 2. Simpan atau Update ke Database
        $data = LayananContent::updateOrCreate(
        [
            'bidang' => strtolower($bidang), 
            'layanan_slug' => strtolower($layanan)
        ],
        ['content' => $request->all()]
        );

        return response()->json([
            'message' => 'Konten layanan berhasil disimpan!',
            'key' => $uniqueKey,
            'data' => $data
        ]);
    }

    /**
     * Mengambil Konten Layanan
     * Route: GET /api/content/{bidang}/{layanan}
     */
    public function show($bidang, $layanan) {
        $uniqueKey = strtolower($bidang) . '_' . strtolower($layanan);

        $data = LayananContent::where('bidang', strtolower($bidang))
              ->where('layanan_slug', strtolower($layanan))
              ->first();

        // Jika data belum ada, kembalikan default kosong
        if(!$data) {
            return response()->json([
                'layanan' => $layanan,
                'isPersyaratanActive' => false,
                'isAlurActive' => false,
                'persyaratan' => [],
                'alur' => [],
                'downloads' => [],
                'jamOperasional' => [],
                'mapLink' => ""
            ], 200); 
        }

        return response()->json($data->content);
    }
}
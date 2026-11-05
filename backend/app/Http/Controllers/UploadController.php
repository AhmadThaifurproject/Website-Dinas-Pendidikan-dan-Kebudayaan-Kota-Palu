<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function upload(Request $request, $bidang, $layanan)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:50480',
        ]);

        $bidang = strtolower($bidang);
        $layanan = strtolower($layanan);

        $folder = "$bidang/$layanan";
        $originalName = $request->file('file')->getClientOriginalName();
        $path = "$folder/$originalName";

        // Flag replace
        $force = $request->input('force') === 'true';

        // ✅ PERUBAHAN: Gunakan disk 'public' (Local Hostinger)
        $disk = Storage::disk('public'); 

        // Cek file di lokasi yg sama
        if ($disk->exists($path)) {
            if ($force) {
                $disk->delete($path);
            } else {
                return response()->json([
                    'message' => 'File sudah ada. Gunakan force=true untuk mengganti.'
                ], 409);
            }
        }

        // Cek duplikasi di lokasi lain
        // Catatan: allFiles() di local storage bisa berat jika file ribuan, tapi untuk folder spesifik masih aman.
        $allFiles = $disk->allFiles(); 
        $duplicateLocations = [];

        foreach ($allFiles as $f) {
            if (basename($f) === $originalName && $f !== $path) {
                $duplicateLocations[] = dirname($f);
            }
        }

        if (!empty($duplicateLocations) && !$force) {
            return response()->json([
                'message' => 'File dengan nama sama ditemukan di lokasi lain.',
                'locations' => $duplicateLocations
            ], 409);
        }

        // ✅ PERUBAHAN: Upload ke Local Storage
        $disk->putFileAs($folder, $request->file('file'), $originalName);

        // ✅ PERUBAHAN URL: Gunakan asset() agar linknya benar (https://api.../storage/...)
        return response()->json([
            'message' => 'File berhasil diupload',
            'path' => $path,
            'url'  => asset('storage/' . $path), 
            'originalName' => $originalName,
        ]);
    }

    public function getFiles($bidang, $layanan)
    {
        $bidang = strtolower($bidang);
        $layanan = strtolower($layanan);
        $folder = "$bidang/$layanan";

        // ✅ PERUBAHAN: Gunakan disk 'public'
        $disk = Storage::disk('public');

        $files = $disk->files($folder);

        $data = array_map(function ($filePath) {
            // ✅ PERUBAHAN URL: Gunakan asset()
            return [
                'name' => basename($filePath),
                'url'  => asset('storage/' . $filePath),
            ];
        }, $files);

        return response()->json(['files' => $data]);
    }

    public function deleteFile($bidang, $layanan, $filename)
    {
        $path = strtolower("$bidang/$layanan/$filename");

        // ✅ PERUBAHAN: Gunakan disk 'public'
        $disk = Storage::disk('public');

        if ($disk->exists($path)) {
            $disk->delete($path);
            return response()->json(['message' => 'Berhasil dihapus']);
        } else {
            return response()->json(['message' => 'Tidak ditemukan'], 404);
        }
    }
}
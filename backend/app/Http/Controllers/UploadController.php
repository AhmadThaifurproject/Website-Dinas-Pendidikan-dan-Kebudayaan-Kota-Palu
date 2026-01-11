<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Contracts\Filesystem\Cloud;

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

        /** @var Cloud $disk */
        $disk = Storage::disk('minio'); // ← PASTI MINIO

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

        // Upload ke MinIO
        $disk->putFileAs($folder, $request->file('file'), $originalName);

        return response()->json([
            'message' => 'File berhasil diupload',
            'path' => $path,
            'url'  => $disk->url($path), // URL MinIO
            'originalName' => $originalName,
        ]);
    }

    public function getFiles($bidang, $layanan)
    {
        $bidang = strtolower($bidang);
        $layanan = strtolower($layanan);
        $folder = "$bidang/$layanan";

        /** @var Cloud $disk */
        $disk = Storage::disk('minio'); // ← MINIO

        $files = $disk->files($folder);

        $data = array_map(function ($filePath) use ($disk) {
            return [
                'name' => basename($filePath),
                'url'  => $disk->url($filePath),
            ];
        }, $files);

        return response()->json(['files' => $data]);
    }

    public function deleteFile($bidang, $layanan, $filename)
    {
        $path = strtolower("$bidang/$layanan/$filename");

        /** @var Cloud $disk */
        $disk = Storage::disk('minio'); // ← MINIO

        if ($disk->exists($path)) {
            $disk->delete($path);
            return response()->json(['message' => 'Berhasil dihapus']);
        } else {
            return response()->json(['message' => 'Tidak ditemukan'], 404);
        }
    }
}

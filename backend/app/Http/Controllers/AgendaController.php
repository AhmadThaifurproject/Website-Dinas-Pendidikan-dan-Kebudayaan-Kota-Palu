<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Models\AgendaItem;

class AgendaController extends Controller
{
    public function update(Request $request)
    {
        // =========================================================
        // LANGKAH 1: PRE-PROCESSING (CARA KEBAL)
        // =========================================================
        // Kita ambil semua input
        $data = $request->all();

        // Cek jika 'items' dikirim sebagai String JSON (karena FormData)
        if ($request->has('items') && is_string($request->input('items'))) {
            // Kita paksa ubah jadi Array PHP asli
            $decodedItems = json_decode($request->input('items'), true);
            
            // Masukkan kembali ke data yang akan divalidasi
            $data['items'] = $decodedItems;
        }

        // =========================================================
        // LANGKAH 2: VALIDASI (SEKARANG BISA PAKAI 'ARRAY')
        // =========================================================
        // Karena di langkah 1 sudah kita ubah jadi array, maka validasi 'array' akan BERHASIL
        $validator = Validator::make($data, [
            'items' => 'required|array', // Sekarang ini valid!
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi Gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        // Gunakan data yang sudah di-decode tadi
        $items = $data['items'];

        // =========================================================
        // LANGKAH 3: PROSES LOOPING & UPLOAD
        // =========================================================
        foreach ($items as $key => &$item) {
            $itemId = isset($item['id']) && !str_starts_with($item['id'], 'new-') ? $item['id'] : null;
            $fileKey = "file_" . ($itemId ?? $item['id']);

            // --- CEK FILE UPLOAD ---
            if ($request->hasFile($fileKey)) {
                $file = $request->file($fileKey);
                
                // Upload ke MinIO
                $path = $file->storePublicly("agenda", 'minio');

                // Generate URL Manual
                $baseUrl = config('filesystems.disks.minio.url'); 
                $url = rtrim($baseUrl, '/') . '/' . ltrim($path, '/');

                $item['mediaUrl'] = $url;
                
                $mime = $file->getMimeType();
                $isVideo = str_contains($mime, 'video');
                
                $item['mediaMeta'] = [
                    'type' => $isVideo ? 'video' : 'image',
                    'provider' => 'MinIO Storage',
                    'previewUrl' => $url,
                    'streamUrl' => $isVideo ? $url : null
                ];
            }
            
            // --- MAPPING KE DATABASE ---
            $dbData = [
                'type'           => $item['type'],
                'title'          => $item['title'] ?? 'Tanpa Judul',
                'description'    => $item['description'] ?? '',
                'date_location'  => $item['dateLocation'] ?? null,
                'caption_source' => $item['captionSource'] ?? 'auto',
                'media_url'      => $item['mediaUrl'] ?? null,
                'target_url'     => $item['targetUrl'] ?? '#',
                'button_text'    => $item['buttonText'] ?? 'Lihat',
                'media_meta'     => json_encode($item['mediaMeta'] ?? []), 
                'media_type'     => $item['mediaMeta']['type'] ?? 'image',
                'sort_order'     => $key,
            ];

            // --- SIMPAN / UPDATE ---
            if ($itemId) {
                AgendaItem::updateOrCreate(['id' => $itemId], $dbData);
            } else {
                $newItem = AgendaItem::create($dbData);
                $item['id'] = $newItem->id; 
            }
        }

        return response()->json($items);
    }

    // Method index biarkan tetap sama seperti sebelumnya
    public function index()
    {
        $items = AgendaItem::orderBy('sort_order', 'asc')->get();
        $formatted = $items->map(function ($item) {
            return [
                'id'            => (string)$item->id,
                'type'          => $item->type,
                'title'         => $item->title,
                'description'   => $item->description,
                'dateLocation'  => $item->date_location,
                'captionSource' => $item->caption_source,
                'mediaUrl'      => $item->media_url,
                'targetUrl'     => $item->target_url,
                'buttonText'    => $item->button_text,
                'mediaMeta'     => json_decode($item->media_meta),
                'uploadSource'  => 'url'
            ];
        });
        return response()->json($formatted);
    }
}
<?php

namespace App\Http\Controllers\Api; 

use App\Http\Controllers\Controller; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http; // <--- PENTING: Untuk Scraping URL
use App\Models\AgendaItem;

class AgendaController extends Controller
{
    // --- 1. FUNGSI UNTUK MENGAMBIL METADATA URL (Baru Ditambahkan) ---
    public function fetchUrlInfo(Request $request)
    {
        $url = $request->input('url');

        if (!$url || !filter_var($url, FILTER_VALIDATE_URL)) {
            return response()->json(['caption' => ''], 400);
        }

        try {
            // A. KHUSUS YOUTUBE (Gunakan oEmbed API resmi)
            if (str_contains($url, 'youtube.com') || str_contains($url, 'youtu.be')) {
                $oembedUrl = "https://www.youtube.com/oembed?url=" . $url . "&format=json";
                $response = Http::get($oembedUrl);
                
                if ($response->successful()) {
                    $data = $response->json();
                    return response()->json([
                        'caption' => $data['title'] ?? '' // Ambil Judul Video
                    ]);
                }
            }

            // B. WEBSITE UMUM (Scraping sederhana)
            // Timeout 5 detik agar tidak loading lama
            $response = Http::timeout(5)->get($url);
            
            if ($response->successful()) {
                $html = $response->body();

                // Cari Open Graph Description
                if (preg_match('/<meta[^>]+property="og:description"[^>]+content="([^"]+)"/i', $html, $matches)) {
                    return response()->json(['caption' => html_entity_decode($matches[1])]);
                }

                // Cari Meta Description
                if (preg_match('/<meta[^>]+name="description"[^>]+content="([^"]+)"/i', $html, $matches)) {
                    return response()->json(['caption' => html_entity_decode($matches[1])]);
                }

                // Cari Title Halaman
                if (preg_match('/<title[^>]*>(.*?)<\/title>/is', $html, $matches)) {
                    return response()->json(['caption' => html_entity_decode($matches[1])]);
                }
            }

            return response()->json(['caption' => '']); // Berhasil connect tapi tidak nemu data

        } catch (\Exception $e) {
            // Error koneksi atau parsing
            return response()->json(['caption' => ''], 500);
        }
    }

    // --- 2. FUNGSI UPDATE DATA ---
    public function update(Request $request)
    {
        // 1. PRE-PROCESSING JSON
        $data = $request->all();
        if (isset($data['items']) && is_string($data['items'])) {
            $decoded = json_decode($data['items'], true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $data['items'] = $decoded;
            }
        }

        // 2. VALIDASI
        $validator = Validator::make($data, [
            'items' => 'required|array',
            'items.*.type' => 'required|in:main,grid', 
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validasi Gagal', 'errors' => $validator->errors()], 422);
        }

        $items = $data['items'];

        // 3. PROSES SIMPAN
        try {
            foreach ($items as $key => &$item) {
                $itemId = isset($item['id']) && !str_starts_with($item['id'], 'new-') ? $item['id'] : null;
                $fileKey = "file_" . ($itemId ?? $item['id']);

                if ($request->hasFile($fileKey)) {
                    $file = $request->file($fileKey);

                    // Ambil URL MinIO
                    $baseUrl = config('filesystems.disks.minio.url') ?? env('MINIO_URL');
                    if (!$baseUrl) throw new \Exception("Konfigurasi MINIO_URL belum diset.");

                    // Upload
                    $path = $file->storePublicly("agenda", 'minio'); 
                    if (!$path) throw new \Exception("Gagal upload ke MinIO.");

                    $url = rtrim($baseUrl, '/') . '/' . ltrim($path, '/');
                    $item['mediaUrl'] = $url;
                    
                    $mime = $file->getMimeType();
                    $isVideo = str_contains($mime, 'video');
                    
                    $item['mediaMeta'] = [
                        'type' => $isVideo ? 'video' : 'image',
                        'provider' => 'MinIO Storage',
                        'previewUrl' => $url,
                        'streamUrl' => $isVideo ? $url : null,
                        'caption' => $item['mediaMeta']['caption'] ?? '' 
                    ];
                }

                // Prepare DB Data
                $mediaMetaToSave = $item['mediaMeta'] ?? [];
                if (is_string($mediaMetaToSave)) {
                     $mediaMetaToSave = json_decode($mediaMetaToSave, true) ?? [];
                }

                $dbData = [
                    'type'           => $item['type'],
                    'title'          => $item['title'] ?? '',
                    'description'    => $item['description'] ?? '',
                    'date_location'  => $item['dateLocation'] ?? null,
                    'caption_source' => $item['captionSource'] ?? 'auto',
                    'media_url'      => $item['mediaUrl'] ?? null,
                    'target_url'     => $item['targetUrl'] ?? '#',
                    'button_text'    => $item['buttonText'] ?? 'Lihat',
                    'media_meta'     => json_encode($mediaMetaToSave),
                    'media_type'     => $mediaMetaToSave['type'] ?? 'image',
                    'sort_order'     => $key,
                ];

                if ($itemId) {
                    AgendaItem::updateOrCreate(['id' => $itemId], $dbData);
                } else {
                    $newItem = AgendaItem::create($dbData);
                    $item['id'] = $newItem->id; 
                }
            }
            
            return response()->json($items);

        } catch (\Exception $e) {
            Log::error("Error Agenda Update: " . $e->getMessage());
            return response()->json([
                'message' => 'Terjadi Kesalahan Server',
                'error_detail' => $e->getMessage()
            ], 500);
        }
    }

    // --- 3. FUNGSI GET DATA ---
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
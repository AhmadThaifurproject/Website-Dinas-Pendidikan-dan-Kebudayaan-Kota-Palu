<?php

namespace App\Http\Controllers\Api; 

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use App\Models\AgendaItem;

class AgendaController extends Controller
{
    // =================================================================
    // 1. FETCH METADATA (UNTUK PREVIEW LINK)
    // =================================================================
    public function fetchUrlInfo(Request $request)
    {
        $url = $request->input('url');

        if (!$url || !filter_var($url, FILTER_VALIDATE_URL)) {
            return response()->json(['caption' => '', 'image' => ''], 400);
        }

        try {
            // A. KHUSUS YOUTUBE
            if (str_contains($url, 'youtube.com') || str_contains($url, 'youtu.be')) {
                $oembedUrl = "https://www.youtube.com/oembed?url=" . $url . "&format=json";
                $response = Http::get($oembedUrl);
                
                if ($response->successful()) {
                    $data = $response->json();
                    return response()->json([
                        'caption' => $data['title'] ?? '',
                        'image'   => $data['thumbnail_url'] ?? '',
                        'provider'=> 'youtube'
                    ]);
                }
            }

            // B. WEBSITE LAIN
            $response = Http::timeout(5)->get($url);
            
            if ($response->successful()) {
                $html = $response->body();
                $caption = '';

                if (preg_match('/<title[^>]*>(.*?)<\/title>/is', $html, $matches)) {
                    $caption = trim(strip_tags(html_entity_decode($matches[1])));
                }

                return response()->json([
                    'caption' => $caption,
                    'image'   => '',
                    'provider'=> 'link'
                ]);
            }

            return response()->json(['caption' => '', 'image' => '']);

        } catch (\Exception $e) {
            return response()->json(['caption' => '', 'image' => ''], 200);
        }
    }

    // =================================================================
    // 2. STORE (SIMPAN & UPDATE BULK) - DULU NAMANYA UPDATE
    // =================================================================
    // Kita ubah namanya jadi 'store' agar cocok dengan Route::post('/agenda')
    public function store(Request $request)
    {
        $data = $request->all();
        
        // Decode JSON string jika dikirim via FormData
        if (isset($data['items']) && is_string($data['items'])) {
            $decoded = json_decode($data['items'], true);
            if (json_last_error() === JSON_ERROR_NONE) $data['items'] = $decoded;
        }

        $validator = Validator::make($data, [
            'items' => 'required|array',
            'items.*.type' => 'required|in:main,grid', 
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validasi Gagal', 'errors' => $validator->errors()], 422);
        }

        $items = $data['items'];

        try {
            foreach ($items as $key => &$item) {
                // Cek ID: Jika ada ID dan bukan string "new-xxx", berarti update
                $itemId = isset($item['id']) && !str_starts_with($item['id'], 'new-') ? $item['id'] : null;
                $fileKey = "file_" . ($itemId ?? $item['id']);

                // --- LOGIKA UPLOAD FILE ---
                if ($request->hasFile($fileKey)) {
                    $file = $request->file($fileKey);
                    
                    // Simpan ke storage/app/public/agenda
                    $path = $file->store('agenda', 'public'); 
                    
                    // Generate URL Publik
                    $url = asset('storage/' . $path);

                    $item['mediaUrl'] = $url;
                    
                    $mime = $file->getMimeType();
                    $isVideo = str_contains($mime, 'video');
                    
                    $item['mediaMeta'] = [
                        'type' => $isVideo ? 'video' : 'image',
                        'provider' => 'Local Storage',
                        'previewUrl' => $url,
                        'streamUrl' => $isVideo ? $url : null,
                        'caption' => $item['mediaMeta']['caption'] ?? '' 
                    ];
                }

                // Prepare Data DB
                $mediaMetaToSave = $item['mediaMeta'] ?? [];
                if (is_string($mediaMetaToSave)) $mediaMetaToSave = json_decode($mediaMetaToSave, true) ?? [];

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
                    // Update data lama
                    AgendaItem::updateOrCreate(['id' => $itemId], $dbData);
                } else {
                    // Buat data baru
                    $newItem = AgendaItem::create($dbData);
                    $item['id'] = $newItem->id; 
                }
            }
            
            return response()->json($items);

        } catch (\Exception $e) {
            Log::error("Error Agenda Update: " . $e->getMessage());
            return response()->json(['message' => 'Server Error', 'error' => $e->getMessage()], 500);
        }
    }

    // =================================================================
    // 3. DESTROY (HAPUS DATA) - INI YANG KEMARIN HILANG
    // =================================================================
    public function destroy($id)
    {
        try {
            $agenda = AgendaItem::findOrFail($id);

            // Opsional: Hapus file gambarnya juga dari storage jika mau bersih
            // if ($agenda->media_url) {
            //     // Logic hapus file di sini (perlu parsing path dari URL)
            // }

            $agenda->delete();

            return response()->json(['message' => 'Agenda berhasil dihapus']);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal menghapus data', 'error' => $e->getMessage()], 500);
        }
    }

    // =================================================================
    // 4. INDEX (GET ALL DATA)
    // =================================================================
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
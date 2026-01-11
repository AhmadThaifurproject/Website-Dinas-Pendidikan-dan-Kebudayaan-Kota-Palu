<?php

namespace App\Services;

use Embed\Embed;

class MediaResolverService
{
    public function resolve(string $url): array
    {
        // Default Metadata (Fallback)
        $meta = [
            'type' => 'link', // default
            'provider' => 'web',
            'previewUrl' => null, // Thumbnail
            'caption' => null,
            'html' => null, // Untuk iframe embed code jika ada
        ];

        try {
            // 1. Deteksi Direct File (MP4/WebM)
            $path = parse_url($url, PHP_URL_PATH);
            $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
            
            if (in_array($extension, ['mp4', 'webm', 'mov', 'ogg'])) {
                return [
                    'type' => 'video',
                    'provider' => 'direct',
                    'previewUrl' => null, 
                    'streamUrl' => $url,
                    'caption' => basename($path),
                ];
            }

            // 2. Deteksi Direct Image (JPG/PNG)
            if (in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                return [
                    'type' => 'image',
                    'provider' => 'direct',
                    'previewUrl' => $url,
                    'caption' => basename($path),
                ];
            }

            // 3. THE MAGIC: Gunakan Library Embed untuk SEMUA Sosmed
            $embed = new Embed();
            $info = $embed->get($url);

            // Ambil data OEmbed / OpenGraph
            $meta['provider'] = strtolower($info->providerName ?? 'external');
            $meta['caption'] = $info->title ?? $info->description ?? null;
            $meta['previewUrl'] = (string) $info->image; // URL Thumbnail Otomatis
            
            // Tentukan Type
            $oembedType = $info->getOEmbed()->get('type');
            
            if ($oembedType === 'video' || in_array($meta['provider'], ['tiktok', 'youtube', 'instagram', 'vimeo'])) {
                $meta['type'] = 'external_video';
            } elseif ($oembedType === 'photo' || $oembedType === 'image') {
                $meta['type'] = 'image';
            } else {
                $meta['type'] = 'link'; 
            }

        } catch (\Exception $e) {
            // Jika gagal scan, kembalikan data minimal agar tidak error 500
            $meta['caption'] = "Konten dari URL ini tidak dapat dipreview otomatis.";
        }

        return $meta;
    }
}
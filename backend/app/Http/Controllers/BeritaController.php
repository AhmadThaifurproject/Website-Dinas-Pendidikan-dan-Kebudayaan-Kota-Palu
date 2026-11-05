<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Berita;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Models\Tag;
use Illuminate\Support\Facades\Response;

class BeritaController extends Controller
{
    // =================================================================
    // HELPER FUNCTIONS (KHUSUS LOCAL STORAGE HOSTINGER)
    // =================================================================

    private function getStorageUrl($path)
    {
        if (!$path) return null;
        
        if (str_starts_with($path, 'data:image') || str_starts_with($path, 'http')) {
            return $path;
        }

        return asset('storage/' . $path);
    }

    private function cleanStoragePath($fullUrl)
    {
        if (!$fullUrl) return null;
        $baseUrl = asset('storage') . '/';

        if (str_contains($fullUrl, $baseUrl)) {
            return str_replace($baseUrl, '', $fullUrl);
        }

        $parsed = parse_url($fullUrl);
        if (isset($parsed['path'])) {
            $path = ltrim($parsed['path'], '/');
            if (str_starts_with($path, 'storage/')) {
                return substr($path, 8);
            }
            return $path;
        }

        return $fullUrl;
    }

    /**
     * Helper untuk menghasilkan slug yang unik di tabel beritas
     */
    private function generateUniqueSlug($judul, $id = null)
    {
        $slug = Str::slug($judul);
        $originalSlug = $slug;
        $count = 1;

        // Cek apakah slug sudah digunakan oleh berita lain
        while (Berita::where('slug', $slug)->when($id, function ($query, $id) {
            return $query->where('id', '!=', $id);
        })->exists()) {
            $slug = $originalSlug . '-' . $count;
            $count++;
        }

        return $slug;
    }

    // =================================================================
    // MAIN FUNCTIONS
    // =================================================================

    public function store(Request $request)
    {
        $request->validate([
            'judul'      => 'required|string|max:255',
            'isi_berita' => 'required|string',
            'penulis'    => 'required|string|max:255',
            'gambar'     => 'nullable|string', 
            'gambar_url' => 'nullable|string',           
            'jadwal'     => 'nullable|date',
            'kategori'   => 'nullable|string|max:255',
            'tags'       => 'nullable|array',
            'tags.*'     => 'string|max:255',
        ]);

        $gambarData = $request->gambar;

        if (!$gambarData && $request->filled('gambar_url')) {
            $gambarData = $this->cleanStoragePath($request->input('gambar_url'));
        }

        // ✅ TERAPKAN SOLUSI 1: Generate Slug Unik
        $slug = $this->generateUniqueSlug($request->judul);

        $berita = Berita::create([
            'judul'          => $request->judul,
            'slug'           => $slug,
            'isi_berita'     => $request->isi_berita,
            'penulis'        => $request->penulis,
            'gambar'         => $gambarData, 
            'tanggal_upload' => $request->jadwal ?? now(),
            'views'          => 0,
            'jadwal'         => $request->jadwal,
            'kategori'       => $request->kategori,
        ]);

        $tagIds = collect($request->tags ?? [])
            ->map(fn($tagName) => Tag::firstOrCreate(['nama' => $tagName])->id);

        $berita->tags()->sync($tagIds);

        return response()->json([
            'message'    => 'Berita & tag berhasil disimpan',
            'data'       => $berita->load('tags'),
            'gambar_url' => $this->getStorageUrl($berita->gambar),
        ], 201);
    }

    public function update(Request $request, $slug)
    {
        $berita = Berita::where('slug', $slug)->firstOrFail();

        $request->validate([
            'judul'      => 'required|string|max:255',
            'isi_berita' => 'required|string',
            'penulis'    => 'required|string|max:255',
            'gambar'     => 'nullable|string',
            'gambar_url' => 'nullable|string',
            'jadwal'     => 'nullable|date',
            'kategori'   => 'nullable|string|max:255',
            'tags'       => 'nullable|array',
        ]);

        $gambarData = $request->gambar ?? $berita->gambar;

        if ($request->filled('gambar_url')) {
            $gambarData = $this->cleanStoragePath($request->input('gambar_url'));
        }

        // ✅ TERAPKAN SOLUSI 1: Update slug jika judul berubah, pastikan tetap unik
        $newSlug = $this->generateUniqueSlug($request->judul, $berita->id);

        $berita->update([
            'judul'      => $request->judul,
            'slug'       => $newSlug,
            'isi_berita' => $request->isi_berita,
            'penulis'    => $request->penulis,
            'gambar'     => $gambarData, 
            'jadwal'     => $request->jadwal,
            'kategori'   => $request->kategori,
        ]);

        if ($request->has('tags')) {
            $tagIds = collect($request->tags ?? [])
                ->map(fn($tagName) => Tag::firstOrCreate(['nama' => $tagName])->id);
            $berita->tags()->sync($tagIds);
        }

        return response()->json([
            'message'    => 'Berita berhasil diperbarui',
            'data'       => $berita->load('tags'),
            'gambar_url' => $this->getStorageUrl($berita->gambar),
        ]);
    }

    // Fungsi index, showBySlug, destroy, setHighlight, highlight, uploadEditorImage 
    // tetap sama seperti sebelumnya...

    public function index()
    {
        $items = Berita::with('tags')
            ->orderBy('tanggal_upload', 'desc')
            ->get()
            ->map(function ($b) {
                return [
                    'id'             => $b->id,
                    'judul'          => $b->judul,
                    'slug'           => $b->slug,
                    'kategori'       => $b->kategori, 
                    'gambar_url'     => $this->getStorageUrl($b->gambar),
                    'tanggal_upload' => $b->tanggal_upload,
                    'penulis'        => $b->penulis,
                    'tags'           => $b->tags,
                    'isi_berita'     => $b->isi_berita,
                    'views'          => $b->views,
                ];
            });

        return response()->json($items);
    }

    public function showBySlug($slug)
    {
        $b = Berita::where('slug', $slug)->with('tags')->firstOrFail();
        return response()->json([
            'data'       => $b,
            'gambar_url' => $this->getStorageUrl($b->gambar),
        ]);
    }

    public function destroy($slug)
    {
        $b = Berita::where('slug', $slug)->firstOrFail();
        if ($b->gambar && !str_starts_with($b->gambar, 'data:image') && Storage::disk('public')->exists($b->gambar)) {
            Storage::disk('public')->delete($b->gambar);
        }
        $b->delete();
        return response()->json(['message' => 'Berita berhasil dihapus']);
    }

    public function setHighlight(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'slug' => 'required|string|exists:beritas,slug',
            'highlight' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->boolean('highlight')) {
            Berita::where('highlight', true)->update(['highlight' => false]);
        }

        $berita = Berita::where('slug', $request->slug)->firstOrFail();
        $berita->update([
            'highlight' => $request->boolean('highlight'),
            'status_tampil' => true
        ]);

        return response()->json([
            'message' => 'Status tampilan berita berhasil diperbarui',
            'data' => $berita
        ]);
    }

    public function highlight()
    {
        $items = Berita::where('status_tampil', true)
            ->orderByDesc('tanggal_upload')
            ->get()
            ->map(function ($b) {
                $thumbnail = $this->getStorageUrl($b->gambar);
                if (!$thumbnail) {
                    $thumbnail = $this->extractFirstImageFromHtml($b->isi_berita);
                }

                return [
                    'id'           => $b->id,
                    'slug'         => $b->slug,
                    'judul'        => $b->judul,
                    'excerpt'      => Str::limit(strip_tags($b->isi_berita), 120),
                    'thumbnail'    => $thumbnail,
                    'kategori'     => $b->kategori,
                    'highlight'    => (bool) $b->highlight,
                    'published_at' => $b->tanggal_upload,
                ];
            });

        return response()->json($items);
    }

    private function extractFirstImageFromHtml(?string $html)
    {
        if (!$html) return null;
        if (preg_match('/<img[^>]+src="([^">]+)"/i', $html, $matches)) {
            return $matches[1];
        }
        return null;
    }

    public function uploadEditorImage(Request $request)
    {   
        if (!$request->hasFile('image')) {
            return response()->json(['error' => 'Tidak ada file dikirim.'], 400);
        }
        $file = $request->file('image');
        $filename = uniqid() . '_' . $file->getClientOriginalName();
        $folder = 'editor_images';
        Storage::disk('public')->putFileAs($folder, $file, $filename);

        return response()->json([
            'url' => asset('storage/' . $folder . '/' . $filename)
        ]);
    }
}
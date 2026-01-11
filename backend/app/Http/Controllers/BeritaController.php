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
    private function minioUrl($path)
    {
        if (!$path) return null;
        return rtrim(env('MINIO_URL'), '/') . '/' . $path;
    }
   // Helper untuk mengubah URL Lengkap menjadi Path MinIO
    // Contoh Input: http://127.0.0.1:9000/disdikbud-files/gambar_berita/foto.jpg
    // Contoh Output: gambar_berita/foto.jpg
    private function cleanMinioPath($fullUrl)
    {
        if (!$fullUrl) return null;

        // 1. AMBIL BASE URL DARI CONFIG (Bukan dari Storage Facade)
        // Ini mengambil value dari 'url' => env('MINIO_URL')
        $minioUrl = config('filesystems.disks.minio.url');

        // 2. JIKA CONFIG URL KOSONG, RAKIT MANUAL
        // Jika di .env MINIO_URL kosong, kita gabung Endpoint + Bucket
        if (empty($minioUrl)) {
            $endpoint = config('filesystems.disks.minio.endpoint');
            $bucket   = config('filesystems.disks.minio.bucket');
            $minioUrl = $endpoint . '/' . $bucket;
        }

        // 3. NORMALISASI: Pastikan diakhiri slash '/'
        if (!str_ends_with($minioUrl, '/')) {
            $minioUrl .= '/';
        }

        // 4. PROSES PEMBERSIHAN (Logic Utama)
        // Jika URL lengkap mengandung Base URL kita, potong depannya.
        if (str_contains($fullUrl, $minioUrl)) {
            return str_replace($minioUrl, '', $fullUrl);
        }

        // 5. SAFETY NET (Jaga-jaga jika IP beda, misal localhost vs 127.0.0.1)
        // Kita paksa ambil path-nya saja dari URL apapun
        $parsed = parse_url($fullUrl);
        
        if (isset($parsed['path'])) {
            $path = ltrim($parsed['path'], '/'); // Hapus slash di depan
            $bucket = config('filesystems.disks.minio.bucket');

            // Cek apakah path diawali nama bucket? Jika iya, hapus bucketnya
            // Contoh: disdikbud-files/gambar/foto.jpg -> gambar/foto.jpg
            if (str_starts_with($path, $bucket . '/')) {
                // Potong nama bucket + slash
                return substr($path, strlen($bucket) + 1);
            }
            
            return $path;
        }

        // Jika semua cara gagal, kembalikan apa adanya
        return $fullUrl;
    }

  public function store(Request $request)
    {
        // 1. Validasi Input
        $request->validate([
            'judul'      => 'required|string|max:255',
            'isi_berita' => 'required|string',
            'penulis'    => 'required|string|max:255',
            'gambar'     => 'nullable|image|max:20480', // Validasi file upload
            'gambar_url' => 'nullable|string',           // Validasi URL dari editor
            'jadwal'     => 'nullable|date',
            'kategori'   => 'nullable|string|max:255',
            'tags'       => 'nullable|array',
            'tags.*'     => 'string|max:255',
        ]);

        $gambarPath = null;

        // 2. Logika Simpan Gambar (Prioritas)
        
        // PRIORITAS A: Cek File Upload Manual (Input type="file")
        if ($request->hasFile('gambar')) {
            $file = $request->file('gambar');
            $filename = uniqid() . '_' . $file->getClientOriginalName();
            $folder = 'gambar_berita';

            // Set path relatif untuk MinIO
            $gambarPath = $folder . '/' . $filename;
            
            // Upload ke MinIO
            Storage::disk('minio')->putFileAs($folder, $file, $filename);
        }
        // PRIORITAS B: Jika tidak ada file manual, Cek URL dari Editor
        elseif ($request->filled('gambar_url')) {
            // PENTING: Gunakan fungsi helper cleanMinioPath
            // Agar yang tersimpan di DB hanya "folder/file.jpg", bukan "http://localhost:9000/..."
            $gambarPath = $this->cleanMinioPath($request->input('gambar_url'));
        }

        // 3. Simpan ke Database
        $berita = Berita::create([
            'judul'          => $request->judul,
            'slug'           => Str::slug($request->judul),
            'isi_berita'     => $request->isi_berita,
            'penulis'        => $request->penulis,
            'gambar'         => $gambarPath, // Path bersih (relative) atau URL Eksternal
            'tanggal_upload' => $request->jadwal ?? now(),
            'views'          => 0,
            // 'status'      => 'publik', // HAPUS (Biarkan default database yang bekerja)
            'jadwal'         => $request->jadwal,
            'kategori'       => $request->kategori,
        ]);

        // 4. Simpan Tags
        $tagIds = collect($request->tags ?? [])
            ->map(fn($tagName) => Tag::firstOrCreate(['nama' => $tagName])->id);

        $berita->tags()->sync($tagIds);

        // 5. Return Response
        return response()->json([
            'message'    => 'Berita & tag berhasil disimpan',
            'data'       => $berita->load('tags'),
            // Bungkus kembali path menjadi URL Lengkap untuk frontend
            'gambar_url' => $this->minioUrl($berita->gambar),
        ], 201);
    }

public function index()
{
    $items = Berita::with('tags')
        ->orderBy('tanggal_upload', 'desc')
        ->get()
        ->map(function ($b) {
            return [
                'id' => $b->id,
                'judul' => $b->judul,
                'slug' => $b->slug,
                'kategori' => $b->kategori, 
                'gambar_url' => $this->minioUrl($b->gambar),
                'tanggal_upload' => $b->tanggal_upload,
                'penulis' => $b->penulis,
                'tags' => $b->tags,
                'isi_berita' => $b->isi_berita,
                'views' => $b->views,
            ];
        });

    return response()->json($items);
}


    public function showBySlug($slug)
    {
        $b = Berita::where('slug', $slug)
            ->with('tags')
            ->firstOrFail();

        return response()->json([
            'data' => $b,
            'gambar_url' => $this->minioUrl($b->gambar),
        ]);
    }


    public function getBySlug($slug)
    {
        $b = Berita::where('slug', $slug)->first();

        if (!$b) {
            return response()->json(['message' => 'Berita tidak ditemukan'], 404);
        }

         return response()->json([
            'id' => $b->id,
            'judul' => $b->judul,
            'slug' => $b->slug,
            'kategori' => $b->kategori, 
            'isi' => $b->isi_berita,
            'gambar_url' => $this->minioUrl($b->gambar),
            'penulis' => $b->penulis,
            'tanggal_upload' => $b->tanggal_upload,
            'views' => $b->views,
        ]);
    }


    public function show($slug)
    {
        $b = Berita::where('slug', $slug)->firstOrFail();

        return response()->json([
            'judul' => $b->judul,
            'isi' => $b->isi_berita,
            'gambar_url' => $this->minioUrl($b->gambar),
            'tanggal_upload' => $b->created_at?->toDateString(),
            'penulis' => $b->penulis ?? 'Admin',
        ]);
    }


    public function update(Request $request, $slug)
    {
        // 1. Cari Berita Lama
        $berita = Berita::where('slug', $slug)->firstOrFail();

        // 2. Validasi
        $request->validate([
            'judul'      => 'required|string|max:255',
            'isi_berita' => 'required|string',
            'penulis'    => 'required|string|max:255',
            'gambar'     => 'nullable|image|max:20480',
            'gambar_url' => 'nullable|string',
            'jadwal'     => 'nullable|date',
            'kategori'   => 'nullable|string|max:255',
            'tags'       => 'nullable|array',
        ]);

        // 3. Logic Gambar
        $gambarPath = $berita->gambar; // Default pakai gambar lama

        // PRIORITAS A: Upload Manual (Ganti Gambar)
        if ($request->hasFile('gambar')) {
            // Hapus gambar lama di MinIO agar tidak menumpuk sampah (Best Practice)
            if ($gambarPath && Storage::disk('minio')->exists($gambarPath)) {
                Storage::disk('minio')->delete($gambarPath);
            }

            // Upload yang baru
            $file = $request->file('gambar');
            $filename = uniqid() . '_' . $file->getClientOriginalName();
            $folder = 'gambar_berita';
            $gambarPath = $folder . '/' . $filename;
            Storage::disk('minio')->putFileAs($folder, $file, $filename);
        } 
        // PRIORITAS B: Ganti via Editor (URL)
        elseif ($request->filled('gambar_url')) {
            // Bersihkan URL menjadi Path Relative
            $newPath = $this->cleanMinioPath($request->input('gambar_url'));
            
            // Update hanya jika path-nya berbeda
            if ($newPath !== $gambarPath) {
                 $gambarPath = $newPath;
            }
        }

        // 4. Update Tabel Berita (HANYA KOLOM YANG ADA DI TABEL)
        // Tag TIDAK dimasukkan disini agar tidak error SQL
        $berita->update([
            'judul'      => $request->judul,
            'slug'       => Str::slug($request->judul),
            'isi_berita' => $request->isi_berita,
            'penulis'    => $request->penulis,
            'gambar'     => $gambarPath, // Path Bersih
            'jadwal'     => $request->jadwal,
            'kategori'   => $request->kategori,
        ]);

        // 5. Update Relasi Tags (Sync)
        if ($request->has('tags')) {
            $tagIds = collect($request->tags ?? [])
                ->map(fn($tagName) => Tag::firstOrCreate(['nama' => $tagName])->id);
            
            $berita->tags()->sync($tagIds);
        }

        return response()->json([
            'message'    => 'Berita berhasil diperbarui',
            'data'       => $berita->load('tags'),
            'gambar_url' => $this->minioUrl($berita->gambar),
        ]);
    }
    public function destroy($slug)
    {
        $b = Berita::where('slug', $slug)->firstOrFail();

        if ($b->gambar && Storage::disk('minio')->exists($b->gambar)) {
            Storage::disk('minio')->delete($b->gambar);
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

        // KETIK ULANG MANUAL BAGIAN INI JIKA MASIH ERROR SETELAH PASTE
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
    // Ambil data terbaru (tanpa filter status karena kolom sudah dihapus)
    $items = Berita::where('status_tampil', true)
        ->orderByDesc('tanggal_upload')
        ->get()
        ->map(function ($b) {

            $thumbnail = null;

            // 1. Cek apakah kolom gambar di database terisi?
            if ($b->gambar) {
                // CEK PINTAR: Apakah isinya sudah berupa Link Lengkap (http...)?
                if (str_starts_with($b->gambar, 'http')) {
                    // KASUS A: Gambar dari Editor (sudah link lengkap) -> Pakai langsung
                    $thumbnail = $b->gambar;
                } else {
                    // KASUS B: Gambar Upload Manual (masih path pendek) -> Bungkus pakai MinIO
                    $thumbnail = $this->minioUrl($b->gambar);
                }
            } 
            // 2. Jika kolom gambar kosong, cari manual di dalam HTML isi berita
            else {
                $thumbnail = $this->extractFirstImageFromHtml($b->isi_berita);
            }

            return [
                'id'            => $b->id,
                'slug'          => $b->slug,
                'judul'         => $b->judul,
                'excerpt'       => Str::limit(strip_tags($b->isi_berita), 120),
                'thumbnail'     => $thumbnail,
                'kategori'      => $b->kategori,
                'highlight'     => (bool) $b->highlight, // Pastikan ini boolean true/false
                'published_at'  => $b->tanggal_upload,
            ];
        });

    return response()->json($items);
}


    /**
     * Helper: ambil URL gambar pertama dari HTML
     */
    private function extractFirstImageFromHtml(?string $html)
    {
        if (!$html) return null;

        // Cari tag <img src="...">
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
    $path = $folder . '/' . $filename;

    Storage::disk('minio')->putFileAs($folder, $file, $filename);

    return response()->json([
        'url' => rtrim(env('MINIO_URL'), '/') . '/' . $path
    ]);
    }

}

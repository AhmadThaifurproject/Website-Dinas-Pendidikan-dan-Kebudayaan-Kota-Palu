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
 public function store(Request $request)
{
    // 🔍 1️⃣ Log semua data masuk dari frontend//
//Log::info('🟢 DATA MASUK DARI FRONTEND:', $request->all());//

    // 🔍 2️⃣ Jika kamu ingin lihat langsung respon JSON dari backend
    // (sementara waktu untuk debug saja)
    //if (config('app.debug')) {
        //return response()->json([
            //'debug' => $request->all(),
           // 'note'  => 'Ini hanya output debug. Hapus bagian ini kalau sudah cocok.',
        //]);
    //}

    // ✅ 3️⃣ Validasi input
    $request->validate([
        'judul'    => 'required|string|max:255',
        'isi_berita' => 'required|string',
        'penulis'  => 'required|string|max:255',
        'gambar'   => 'nullable|image|max:20480',
        'status'   => 'required|in:draft,publik',
        'jadwal'   => 'nullable|date',
        'kategori' => 'nullable|string|max:255',
        'tags'     => 'nullable|array',
        'tags.*'   => 'string|max:255',
    ]);

    // ✅ 4️⃣ Upload gambar jika ada
    $gambarPath = null;
    if ($request->hasFile('gambar')) {
        $gambarPath = $request->file('gambar')->store('gambar_berita', 'public');
    }

    // ✅ 5️⃣ Simpan data berita
    $berita = Berita::create([
        'judul'          => $request->judul,
        'slug'           => Str::slug($request->judul),
        'isi_berita'     => $request->isi_berita,
        'penulis'        => $request->penulis,
        'gambar'         => $gambarPath,
        'tanggal_upload' => now(),
        'views'          => 0,
        'status'         => $request->status,
        'jadwal'         => $request->jadwal,
        'kategori'       => $request->kategori,
    ]);

    // ✅ 6️⃣ Sinkronisasi tags (kalau dikirim)
    $tagIds = collect($request->tags ?? [])
        ->map(fn($tagName) => Tag::firstOrCreate(['nama' => $tagName])->id);

    $berita->tags()->sync($tagIds);

    // ✅ 7️⃣ Respon akhir
    return response()->json([
        'message' => 'Berita & tag berhasil disimpan',
        'data'    => $berita->load('tags')
    ], 201);
}

    public function index()
    {
        return Berita::with('tags')
        ->orderBy('tanggal_upload', 'desc')
        ->get();
    }
    public function showBySlug($slug)
    {
        // otomatis 404 jika tidak ketemu
        $berita = Berita::where('slug', $slug)
                    ->with('tags') // langsung load relasi tags
                    ->firstOrFail();

        return response()->json($berita);
    }


    public function getBySlug($slug)
    {
        $berita = Berita::where('slug', $slug)->first();

        if (!$berita) {
            return response()->json(['message' => 'Berita tidak ditemukan'], 404);
        }

        return response()->json([
            'id' => $berita->id,
            'judul' => $berita->judul,
            'slug' => $berita->slug,
            'isi' => $berita->isi_berita,
            'gambar' => $berita->gambar ? asset('storage/' . $berita->gambar) : null,
            'penulis' => $berita->penulis,
            'tanggal_upload' => $berita->tanggal_upload,
            'views' => $berita->views
        ]);
    }

    public function show($slug)
{
    $berita = Berita::where('slug', $slug)->firstOrFail();

    // Ambil 1 baris pertama dari isi_berita sebagai preview
    $preview = strtok($berita->isi_berita, "\n");

    return response()->json([
        'title' => $berita->judul,
        'isi' => $berita->isi_berita,
        'image_url' => $berita->gambar
            ? asset('storage/' . $berita->gambar)
            : null,
        'tanggal_upload' => $berita->created_at ? $berita->created_at->toDateString() : null,
        'penulis' => $berita->penulis ?? 'Admin',
    ]);
}


  public function update(Request $request, $slug)
{
    Log::info("=== DEBUG UPDATE START ===", [
        'slug_param' => $slug,
        'incoming' => $request->all(),
    ]);

    $berita = Berita::where('slug', $slug)->firstOrFail();

    $validated = $request->validate([
        'judul'          => 'sometimes|string|max:255',
        'isi_berita'     => 'sometimes|string',
        'penulis'        => 'sometimes|string|max:255',
        'gambar'         => 'sometimes|image|max:20480',
        'tanggal_upload' => 'sometimes|date',
        'status'         => 'sometimes|in:draft,publik',
        'jadwal'         => 'sometimes|date',
        'kategori'       => 'sometimes|string|max:255',
        'tags'           => 'sometimes|string|max:255',
    ]);

    Log::info("=== DEBUG VALIDATED ===", ['validated' => $validated]);

    foreach ($validated as $field => $value) {
        if ($value !== null && $value !== '') {
            $berita->$field = $value;
        }
    }

    Log::info("=== DEBUG AFTER FILL ===", $berita->toArray());

    if ($request->hasFile('gambar')) {

        if ($berita->gambar && file_exists(public_path('storage/' . $berita->gambar))) {
            unlink(public_path('storage/' . $berita->gambar));
        }

        $berita->gambar = $request->file('gambar')->store('gambar_berita', 'public');
    }

    if ($request->filled('judul')) {
        $berita->slug = Str::slug($request->judul);
    }

    Log::info("=== DEBUG BEFORE SAVE ===", [
        'dirty' => $berita->getDirty(),
        'original' => $berita->getOriginal(),
        'final_slug' => $berita->slug,
    ]);

    $berita->save();

    Log::info("=== DEBUG AFTER SAVE ===", [
        'fresh' => $berita->fresh()->toArray()
    ]);

    return response()->json([
        'message' => 'Berita diperbarui',
        'data' => $berita
    ]);
}



    public function destroy($slug)
    {
        $berita = Berita::where('slug', $slug)->first();

        if (!$berita) {
            return response()->json(['message' => 'Berita tidak ditemukan'], 404);
        }

        // hapus file gambar kalau ada
        if ($berita->gambar && file_exists(public_path('storage/' . $berita->gambar))) {
            unlink(public_path('storage/' . $berita->gambar));
        }

        $berita->delete();

        return response()->json(['message' => 'Berita berhasil dihapus']);
    }
public function setHighlight(Request $request)
{
    $validator = Validator::make($request->all(), [
        'slug'     => 'required|string',
        'kategori' => 'required|string',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    // Cari berdasarkan slug
    $berita = Berita::where('slug', $request->slug)->first();

    if (!$berita) {
        return response()->json(['error' => 'Not found'], 404);
    }

    // Update highlight + kategori
    $berita->highlight = true;
    $berita->kategori  = $request->kategori;
    $berita->save();

    return response()->json([
        'message' => 'Berita berhasil ditandai sebagai highlight',
        'data'    => $berita
    ], 200);
}

public function highlight()
{
    $highlighted = Berita::where('highlight', 1)->get();

    $data = $highlighted->map(function ($berita) {
        return [
            'slug' => $berita->slug,
            'title' => $berita->judul,
            'description' => Str::limit(strip_tags($berita->isi_berita), 100), // hanya preview
            'image_url' =>  $berita->gambar ? asset('storage/' . $berita->gambar) : null,
            'category' => $berita->kategori,
        ];
    });

    return response()->json($data);
}



public function highlightImage($filename)
{
    $path = storage_path('app/public/gambar_berita/' . $filename);

    if (!file_exists($path)) {
        abort(404);
    }

    $mimeType = mime_content_type($path);
    return Response::file($path, ['Content-Type' => $mimeType]);
}
public function uploadEditorImage(Request $request)
{
    if (!$request->hasFile('image')) {
        return response()->json(['error' => 'Tidak ada file dikirim.'], 400);
    }

    $path = $request->file('image')->store('editor_images', 'public');

    return response()->json([
        'url' => asset('storage/' . $path)
    ]);
}


}

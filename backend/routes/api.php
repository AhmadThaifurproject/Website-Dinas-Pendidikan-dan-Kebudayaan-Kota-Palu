<?php

use App\Http\Controllers\BeritaController;
use App\Http\Controllers\UploadController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\PengaduanMasyarakatController;

use Illuminate\Http\Request;



// === BERITA HIGHLIGHT ===
Route::post('/berita/set-highlight', [BeritaController::class, 'setHighlight']); 
Route::get('/berita/highlight', [BeritaController::class, 'highlight']);
// Gambar
Route::get('/berita/gambar/{filename}', [BeritaController::class, 'highlightImage']);

// === CRUD BERITA ===
Route::get('/berita', [BeritaController::class, 'index']);
Route::post('/berita', [BeritaController::class, 'store']);
Route::get('/berita/slug/{slug}', [BeritaController::class, 'show']); // hanya 1 show
Route::put('/berita/{slug}', [BeritaController::class, 'update']);
Route::delete('/berita/{slug}', [BeritaController::class, 'destroy']);


// === UPLOAD DINAMIS ===
Route::prefix('{bidang}')->group(function () {
    Route::post('upload/{layanan}', [UploadController::class, 'upload']);
    Route::get('upload/{layanan}', [UploadController::class, 'getFiles']);
    Route::delete('upload/{layanan}/{filename}', [UploadController::class, 'deleteFile']);
});

// ===Auth====
Route::post('/admin/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/admin/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'me']);

// ===Route Pengaduan Masyarakat====
Route::post('/pengaduan', [PengaduanMasyarakatController::class, 'store']);
Route::get('/pengaduan', [PengaduanMasyarakatController::class, 'index']); // Untuk admin
Route::get('/pengaduan/{id}', [PengaduanMasyarakatController::class, 'show']);
Route::put('/pengaduan/{id}/tanggapan', [PengaduanMasyarakatController::class, 'tanggapi']);


// ✅ Tambahkan route uji manual CORS di bawah sini
Route::get('/test-cors', function () {
    return response()->json(['message' => 'CORS aktif!'])
        ->header('Access-Control-Allow-Origin', 'http://localhost:5173')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
});


Route::post('/upload-editor-image', function (Request $request) {
    if (!$request->hasFile('image')) {
        return response()->json(['error' => 'No image uploaded'], 400);
    }

    $path = $request->file('image')->store('editor_images', 'public');
    $url = asset('storage/' . $path);

    return response()->json(['url' => $url]);
});
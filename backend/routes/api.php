<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BeritaController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\PengaduanMasyarakatController;
use App\Http\Controllers\LayananController;
use App\Http\Controllers\Api\AgendaController;
use Illuminate\Http\Request;

// ====================== AUTH ======================
Route::post('/admin/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/admin/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);
});

// ====================== BERITA ======================
Route::prefix('berita')->group(function () {
    // CRUD
    Route::get('/', [BeritaController::class, 'index']);                    // list semua berita
    Route::post('/', [BeritaController::class, 'store']);                   // tambah berita
    Route::get('/slug/{slug}', [BeritaController::class, 'showBySlug']);   // detail berita
    Route::put('/{slug}', [BeritaController::class, 'update']);             // update berita
    Route::delete('/{slug}', [BeritaController::class, 'destroy']);         // hapus berita

    // Highlight
    Route::post('/set-highlight', [BeritaController::class, 'setHighlight']);
    Route::get('/highlight', [BeritaController::class, 'highlight']);

    // Upload gambar editor (MinIO)
  Route::post('/upload-editor-image', [BeritaController::class, 'uploadEditorImage']);

});

// ====================== UPLOAD DINAMIS (MinIO) ======================
Route::prefix('{bidang}/upload/{layanan}')->group(function () {
    Route::post('/', [UploadController::class, 'upload']);          // upload file
    Route::get('/', [UploadController::class, 'getFiles']);        // list file
    Route::delete('/{filename}', [UploadController::class, 'deleteFile']); // hapus file
});


// ====================== UPLOAD DINAMIS (MinIO) ======================
Route::prefix('{bidang}/content/{layanan}')->group(function () {
    Route::get('/', [LayananController::class, 'show']);   // Ambil data JSON (Public)
    Route::post('/', [LayananController::class, 'store']); // Simpan data JSON (Admin)
});

// ====================== PENGADUAN MASYARAKAT ======================
Route::prefix('pengaduan')->group(function () {
    Route::post('/', [PengaduanMasyarakatController::class, 'store']);
    Route::get('/', [PengaduanMasyarakatController::class, 'index']); // untuk admin
    Route::get('/{id}', [PengaduanMasyarakatController::class, 'show']);
    Route::put('/{id}/tanggapan', [PengaduanMasyarakatController::class, 'tanggapi']);
});


// ====================== AGENDA/POSTER ======================
Route::get('/agenda', [AgendaController::class, 'index']); // Load Data
Route::match(['put', 'post'], '/agenda', [AgendaController::class, 'update']);
Route::post('/fetch-metadata', [AgendaController::class, 'fetchUrlInfo']);


// ====================== TEST CORS ======================
Route::get('/test-cors', function () {
    return response()->json(['message' => 'CORS aktif!'])
        ->header('Access-Control-Allow-Origin', 'http://localhost:5173')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
});

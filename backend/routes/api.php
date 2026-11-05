<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BeritaController;
use App\Http\Controllers\Api\AgendaController;
use App\Http\Controllers\Api\KalenderController; 
use App\Http\Controllers\UserController; // <-- Ini sudah ter-import dengan benar
use App\Http\Controllers\UploadController;
use App\Http\Controllers\LayananController;
use App\Http\Controllers\Api\PengaduanMasyarakatController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\FeatureLockTeknisiController; // <-- IMPORT BARU DITAMBAHKAN DI SINI

/*
|--------------------------------------------------------------------------
| AUTH (PUBLIC)
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']); 
});

/*
|--------------------------------------------------------------------------
| PUBLIC API (READ ONLY)
|--------------------------------------------------------------------------
*/
Route::prefix('public')->group(function () {

    // BERITA
    Route::get('/berita', [BeritaController::class, 'index']);
    Route::get('/berita/{slug}', [BeritaController::class, 'showBySlug']);
    Route::get('/berita-highlight', [BeritaController::class, 'highlight']);

    Route::get('/agenda', [AgendaController::class, 'index']);

    // --- KALENDER PUBLIC (READ ONLY) ---
    Route::get('/kalenders', [KalenderController::class, 'index']); 

    // PROFIL PEJABAT (PUBLIC READ)
    Route::get('/profiles', [ProfileController::class, 'index']);

    // LAYANAN (READ)
    Route::get('{bidang}/content/{layanan}', [LayananController::class, 'show']);
    Route::get('{bidang}/upload/{layanan}', [UploadController::class, 'getFiles']);

    // PENGADUAN (HANYA KIRIM)
    Route::post('/pengaduan', [PengaduanMasyarakatController::class, 'store']);
});

/*
|--------------------------------------------------------------------------
| ADMIN API (PROTECTED — ABSOLUT)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {

    /*
    | AUTH SESSION
    */
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    /*
    | MANAJEMEN USER / ADMIN (SUPER ADMIN / TEKNISI)
    */
    // Endpoint ini akan menjadi: /api/admin/users
    Route::get('/users', [UserController::class, 'index']); 

    /*
    | MANAJEMEN GEMBOK FITUR EDITOR (DARI TEKNISI KE ADMIN)
    */
    Route::get('/feature-lock-teknisi', [FeatureLockTeknisiController::class, 'index']); // <--- ROUTE BARU
    Route::post('/feature-lock-teknisi/toggle', [FeatureLockTeknisiController::class, 'toggle']); // <--- ROUTE BARU

    // --- KALENDER ADMIN (FULL CRUD) ---
    Route::prefix('kalenders')->group(function () { 
        Route::get('/', [KalenderController::class, 'index']);
        Route::post('/', [KalenderController::class, 'store']);
        
        // Menggunakan match agar bisa terima update file (POST dengan _method PUT)
        Route::match(['put', 'post'], '/{id}', [KalenderController::class, 'update']); 
        
        Route::delete('/{id}', [KalenderController::class, 'destroy']);
    });

    /*
    | BERITA (FULL CONTROL)
    */
    Route::prefix('berita')->group(function () {
        Route::post('/', [BeritaController::class, 'store']);
        Route::put('/{slug}', [BeritaController::class, 'update']);
        Route::delete('/{slug}', [BeritaController::class, 'destroy']);
        Route::post('/set-highlight', [BeritaController::class, 'setHighlight']);
        Route::post('/upload-editor-image', [BeritaController::class, 'uploadEditorImage']);
    });

    /*
    | PROFIL PEJABAT (ADMIN CONTROL)
    */
    Route::prefix('profiles')->group(function () {
        Route::post('/', [ProfileController::class, 'store']);
        Route::match(['put', 'post'], '/{id}', [ProfileController::class, 'update']); 
        Route::delete('/{id}', [ProfileController::class, 'destroy']);
    });

    /*
    | AGENDA (ADMIN ONLY) - Ini agenda poster lama Anda
    */
    Route::get('/agenda', [AgendaController::class, 'index']);
    Route::post('/agenda', [AgendaController::class, 'store']);
    Route::put('/agenda/{id}', [AgendaController::class, 'update']);
    Route::delete('/agenda/{id}', [AgendaController::class, 'destroy']);

    /*
    | LAYANAN (WRITE)
    */
    Route::post('{bidang}/content/{layanan}', [LayananController::class, 'store']);

    /*
    | UPLOAD FILE (ADMIN ONLY)
    */
    Route::prefix('{bidang}/upload/{layanan}')->group(function () {
        Route::post('/', [UploadController::class, 'upload']);
        Route::get('/', [UploadController::class, 'getFiles']);
        Route::delete('/{filename}', [UploadController::class, 'deleteFile']);
    });

    /*
    | PENGADUAN (ADMIN VIEW & RESPONSE)
    */
    Route::prefix('pengaduan')->group(function () {
        Route::get('/', [PengaduanMasyarakatController::class, 'index']);
        Route::get('/{id}', [PengaduanMasyarakatController::class, 'show']);
        Route::put('/{id}/tanggapan', [PengaduanMasyarakatController::class, 'tanggapi']);
    });
});
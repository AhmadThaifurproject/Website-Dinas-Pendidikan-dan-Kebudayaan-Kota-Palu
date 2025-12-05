<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

// Route root biasa
Route::get('/', function () {
    return view('welcome');
});

// Route untuk preview file
Route::get('/preview/{folder}/{subfolder}/{filename}', function ($folder, $subfolder, $filename) {
    $path = "$folder/$subfolder/$filename";

    if (!Storage::disk('public')->exists($path)) {
        abort(404, 'File tidak ditemukan');
    }

    $fullPath = Storage::disk('public')->path($path);
    $mime = File::mimeType($fullPath);
    $stream = Storage::disk('public')->readStream($path);

    return response()->stream(function () use ($stream) {
        fpassthru($stream);
    }, 200, [
        'Content-Type' => $mime,
        'Access-Control-Allow-Origin' => 'http://localhost:5173',
    ]);
});

// 🧱 Fallback untuk SPA (jangan ganggu /api/*)
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '^(?!api).*$');

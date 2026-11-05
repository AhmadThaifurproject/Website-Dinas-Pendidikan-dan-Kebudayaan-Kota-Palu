<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        
        // 1. ✅ Aktifkan Statefulness untuk API (Sanctum)
        // Ini secara otomatis menangani Session, Cookie, dan EnsureFrontendRequestsAreStateful
        // Anda tidak perlu lagi menulis manual di dalam group('api')
        $middleware->statefulApi();

        // 2. ✅ Tambahkan Alias jika diperlukan
        $middleware->alias([
            'abilities' => \Laravel\Sanctum\Http\Middleware\CheckAbilities::class,
            'ability' => \Laravel\Sanctum\Http\Middleware\CheckForAnyAbility::class,
        ]);

        // 3. ✅ Pengaturan CORS (Laravel 11 sudah include HandleCors secara default)
        // Jika ingin memastikan konfigurasinya terbaca, cukup pastikan file config/cors.php sudah benar.
        // Tidak perlu prepend HandleCors manual kecuali ada masalah spesifik.

    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
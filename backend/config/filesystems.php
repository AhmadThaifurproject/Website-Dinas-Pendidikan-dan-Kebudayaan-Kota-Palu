<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Filesystem Disk
    |--------------------------------------------------------------------------
    |
    | Setting default penyimpanan. Kita arahkan ke 'public' agar file
    | bisa diakses dari browser. Pastikan di .env isinya:
    | FILESYSTEM_DISK=public
    |
    */

    'default' => env('FILESYSTEM_DISK', 'public'),

    /*
    |--------------------------------------------------------------------------
    | Filesystem Disks
    |--------------------------------------------------------------------------
    |
    | Konfigurasi driver penyimpanan. Fokus utama kita ada di disk 'public'.
    |
    */

    'disks' => [

        'local' => [
            'driver' => 'local',
            'root' => storage_path('app/private'), // Folder aman (tidak bisa diakses browser)
            'serve' => true,
            'throw' => false,
            'report' => false,
        ],

        // ✅ INI DISK UTAMA UNTUK HOSTINGER (LOCAL STORAGE)
        'public' => [
            'driver' => 'local',
            'root' => storage_path('app/public'), // Lokasi fisik: storage/app/public
            'url' => env('APP_URL').'/storage',   // URL akses: https://api.domain.com/storage
            'visibility' => 'public',
            'throw' => false,
            'report' => false,
        ],

        's3' => [
            'driver' => 's3',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('AWS_DEFAULT_REGION'),
            'bucket' => env('AWS_BUCKET'),
            'url' => env('AWS_URL'),
            'endpoint' => env('AWS_ENDPOINT'),
            'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
            'throw' => false,
            'report' => false,
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Symbolic Links
    |--------------------------------------------------------------------------
    |
    | Ini adalah peta untuk perintah "php artisan storage:link" atau
    | route "/linkstorage" yang sudah kita buat.
    |
    */

    'links' => [
        public_path('storage') => storage_path('app/public'),
    ],

];
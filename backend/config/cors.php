<?php

return [

    'paths' => [
        'api/*',
        'admin/*',
        'login', 
        'logout',
        'preview/*',
        'sanctum/csrf-cookie',
        'storage/*',
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'https://dinaspendidikankotapalu.id', 
        
        // Cadangan (jika user ketik pakai www)
        'https://www.dinaspendidikankotapalu.id',

        // Localhost (Biar di laptop tetap jalan)
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => ['X-XSRF-TOKEN'],

    'max_age' => 0,

    'supports_credentials' => true,
];
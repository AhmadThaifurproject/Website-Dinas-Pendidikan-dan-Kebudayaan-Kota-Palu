<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AddCorsToStorage
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        if ($request->is('storage/*')) {
            $response->headers->set('Access-Control-Allow-Origin', 'http://localhost:5173');
            $response->headers->set('Access-Control-Allow-Methods', 'GET, OPTIONS');
            $response->headers->set('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
        }

        return $response;
    }
}

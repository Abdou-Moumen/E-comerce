<?php
// app/Http/Middleware/LogApiRequestData.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Log;

class LogApiRequestData
{
    public function handle($request, Closure $next)
    {
        $data = $request->all();

        // Log request details (adjust based on your needs)
        Log::info('API Request:', [
            'method' => $request->method(),
            'uri' => $request->uri(),
            'headers' => $request->headers->all(),
            'data' => $data,
        ]);

        return $next($request);
    }
}

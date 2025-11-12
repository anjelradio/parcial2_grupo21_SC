<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    /**
     * Middlewares globales que se ejecutan en todas las solicitudes
     */
    protected $middleware = [
        // ⚙️ Middleware base de Laravel
        \Illuminate\Foundation\Http\Middleware\CheckForMaintenanceMode::class,
        \Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,
        \Illuminate\Foundation\Http\Middleware\TrimStrings::class,
        \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
        \Illuminate\Http\Middleware\TrustProxies::class,

        // 🔥 Habilitar CORS globalmente
        \Illuminate\Http\Middleware\HandleCors::class,
    ];

    /**
     * Grupos de middleware
     */
    protected $middlewareGroups = [
        'web' => [
            \App\Http\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],

        'api' => [
            // ⚙️ throttle = límite de peticiones
            'throttle:api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,

            // 🔥 CORS para las rutas API
            \Illuminate\Http\Middleware\HandleCors::class,
        ],
    ];

    /**
     * Middlewares individuales asignables a rutas
     */
    protected $routeMiddleware = [
        'auth' => \App\Http\Middleware\Authenticate::class,
        'check.admin' => \App\Http\Middleware\CheckAdminMiddleware::class,
        'bindings' => \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ];
}

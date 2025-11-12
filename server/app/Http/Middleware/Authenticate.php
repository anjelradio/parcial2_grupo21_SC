<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Obtiene la ruta a la que se redirige si el usuario no está autenticado.
     */
    protected function redirectTo($request)
{
        if (! $request->expectsJson()) {
            abort(response()->json([
                'ok' => false,
                'message' => 'No autenticado o token inválido'
            ], 401));
        }
    }
}

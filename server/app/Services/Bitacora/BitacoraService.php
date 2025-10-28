<?php

namespace App\Services\Bitacora;

use App\Models\Bitacora;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class BitacoraService
{
    /**
     * Registrar una acción en la bitácora
     */
    public function registrar(string $accion, ?string $ip = null)
    {
        try {
            Bitacora::create([
                'user_id' => Auth::id(),
                'accion' => $accion,
                'fecha_hora' => now('America/La_Paz'),
                'ip' => $ip ?? request()->ip(),
            ]);
        } catch (\Exception $e) {
            // Log silencioso para no interrumpir el flujo principal
            Log::error('Error al registrar bitácora: ' . $e->getMessage());
        }
    }

    /**
     * Obtener todas las bitácoras (con paginación opcional)
     */
    public function getAll($perPage = 50)
    {
        return Bitacora::with('user:id,nombre,apellido_paterno,apellido_materno,email,rol')
            ->recientes()
            ->paginate($perPage);
    }

    /**
     * Obtener bitácoras por usuario
     */
    public function getPorUsuario($userId, $perPage = 50)
    {
        return Bitacora::with('user:id,nombre,apellido_paterno,apellido_materno,email,rol')
            ->porUsuario($userId)
            ->recientes()
            ->paginate($perPage);
    }

    /**
     * Buscar en bitácoras por texto en acción
     */
    public function buscar(string $texto, $perPage = 50)
    {
        return Bitacora::with('user:id,nombre,apellido_paterno,apellido_materno,email,rol')
            ->accionContiene($texto)
            ->recientes()
            ->paginate($perPage);
    }
}
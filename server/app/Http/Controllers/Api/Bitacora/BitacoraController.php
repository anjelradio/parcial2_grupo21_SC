<?php

namespace App\Http\Controllers\Api\Bitacora;

use App\Http\Controllers\Controller;
use App\Services\Bitacora\BitacoraService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class BitacoraController extends Controller
{
    use ApiResponse;

    protected $bitacoraService;

    public function __construct(BitacoraService $bitacoraService)
    {
        $this->bitacoraService = $bitacoraService;
    }

    /**
     * Obtener todas las bitácoras (con paginación)
     */
    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 50);
            $bitacoras = $this->bitacoraService->getAll($perPage);
            
            return $this->paginate($bitacoras, 'Bitácoras obtenidas correctamente');
        } catch (\Exception $e) {
            return $this->error('Error al obtener bitácoras: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Obtener bitácoras por usuario
     */
    public function porUsuario(Request $request, $userId)
    {
        try {
            $perPage = $request->input('per_page', 50);
            $bitacoras = $this->bitacoraService->getPorUsuario($userId, $perPage);
            
            return $this->paginate($bitacoras, 'Bitácoras del usuario obtenidas correctamente');
        } catch (\Exception $e) {
            return $this->error('Error al obtener bitácoras del usuario: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Buscar bitácoras por texto
     */
    public function buscar(Request $request)
    {
        try {
            $texto = $request->input('q', '');
            $perPage = $request->input('per_page', 50);
            
            if (empty($texto)) {
                return $this->error('Debe proporcionar un texto de búsqueda', 400);
            }
            
            $bitacoras = $this->bitacoraService->buscar($texto, $perPage);
            
            return $this->paginate($bitacoras, 'Resultados de búsqueda obtenidos correctamente');
        } catch (\Exception $e) {
            return $this->error('Error al buscar en bitácoras: ' . $e->getMessage(), 500);
        }
    }
}
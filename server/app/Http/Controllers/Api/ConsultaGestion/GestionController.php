<?php

namespace App\Http\Controllers\Api\ConsultaGestion;

use App\Http\Controllers\Controller;
use App\Models\GestionAcademica;
use App\Services\ConsultaGestion\GestionService;
use App\Traits\ApiResponse;

class GestionController extends Controller
{
    use ApiResponse;

    protected $service;

    public function __construct(GestionService $service)
    {
        $this->service = $service;
    }

    /**
     * GET /api/consulta-gestion/semestres
     * Trae todos los semestres registrados
     */
    public function listarSemestres()
    {
        try {
            $gestiones = $this->service->obtenerGestiones();

            return $this->success(
                $gestiones,
                'Lista de semestres obtenida correctamente.'
            );
        } catch (\Exception $e) {
            return $this->error('Error al obtener los semestres.', 500, $e->getMessage());
        }
    }
}

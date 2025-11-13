<?php

namespace App\Http\Controllers\Api\ConsultaGestion;

use App\Http\Controllers\Controller;
use App\Services\ConsultaGestion\EstadisticaService;
use App\Traits\ApiResponse;

class EstadisticaController extends Controller
{
    use ApiResponse;

    protected $service;

    public function __construct(EstadisticaService $service)
    {
        $this->service = $service;
    }

    /**
     * GET /api/consulta-gestion/{id_gestion}/estadisticas
     */
    public function obtenerEstadisticas($id_gestion)
    {
        try {
            $estadisticas = $this->service->calcularEstadisticas($id_gestion);
            return $this->success($estadisticas, 'Estadísticas de la gestión obtenidas correctamente.');
        } catch (\Exception $e) {
            return $this->error('Error al obtener las estadísticas.', 500, $e->getMessage());
        }
    }
}

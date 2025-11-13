<?php

namespace App\Http\Controllers\Api\SupervisionAsistencias;

use App\Http\Controllers\Controller;
use App\Services\SupervisionAsistencias\EstadisticaService;
use App\Traits\ApiResponse;

class EstadisticaSupAsistenciaController extends Controller
{
    use ApiResponse;

    protected $service;

    public function __construct(EstadisticaService $service)
    {
        $this->service = $service;
    }

    /**
     * GET /api/supervision-asistencias/estadisticas/{id_gestion?}
     */
    public function obtenerEstadisticas($id_gestion = null)
    {
        try {
            $data = $this->service->calcularEstadisticas($id_gestion);

            return $this->success(
                $data,
                'Estadísticas obtenidas correctamente.'
            );

        } catch (\Exception $e) {

            return $this->error(
                'Error al obtener las estadísticas.',
                500,
                $e->getMessage()
            );
        }
    }
}

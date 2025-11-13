<?php

namespace App\Http\Controllers\Api\SupervisionAsistencias;

use App\Http\Controllers\Controller;
use App\Services\SupervisionAsistencias\AsignacionDetalleService;
use App\Traits\ApiResponse;

class AsignacionSupAsistenciaController extends Controller
{
    use ApiResponse;

    protected $service;

    public function __construct(AsignacionDetalleService $service)
    {
        $this->service = $service;
    }

    /**
     * GET /api/supervision-asistencias/asignacion/{id_asignacion}
     */
    public function obtenerDetalle($id_asignacion)
    {
        try {
            $data = $this->service->obtenerDetalleAsignacion($id_asignacion);

            return $this->success(
                $data,
                'Detalle de asignación obtenido correctamente.'
            );

        } catch (\Exception $e) {

            return $this->error(
                'Error al obtener el detalle de la asignación.',
                500,
                $e->getMessage()
            );
        }
    }
}

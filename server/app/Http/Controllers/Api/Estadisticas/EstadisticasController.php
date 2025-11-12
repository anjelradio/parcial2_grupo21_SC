<?php

namespace App\Http\Controllers\Api\Estadisticas;

use App\Http\Controllers\Controller;
use App\Services\Estadisticas\EstadisticasService;
use App\Traits\ApiResponse;

class EstadisticasController extends Controller
{
    use ApiResponse;

    protected $estadisticasService;

    public function __construct(EstadisticasService $estadisticasService)
    {
        $this->estadisticasService = $estadisticasService;
    }

    /**
     * Endpoint: /api/estadisticas/globales
     * Devuelve todas las estadísticas disponibles
     */
    public function index()
    {
        try {
            $estadisticas = $this->estadisticasService->getAllEstadisticas();

            return $estadisticas['ok']
                ? $this->success($estadisticas['data'], $estadisticas['message'])
                : $this->error($estadisticas['message'], 404);
        } catch (\Exception $e) {
            return $this->error('Error al obtener estadísticas: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Endpoint: /api/estadisticas/control-docente
     * Devuelve solo las estadísticas del módulo Control Docente
     */
    public function controlDocente()
    {
        try {
            $estadisticas = $this->estadisticasService->getEstadisticasControlDocente();

            return $estadisticas['ok']
                ? $this->success($estadisticas['data'], $estadisticas['message'])
                : $this->error($estadisticas['message'], 404);
        } catch (\Exception $e) {
            return $this->error('Error al obtener estadísticas: ' . $e->getMessage(), 500);
        }
    }
}

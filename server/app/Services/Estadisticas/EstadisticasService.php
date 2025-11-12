<?php

namespace App\Services\Estadisticas;

class EstadisticasService
{
    protected $controlDocenteStatsService;

    public function __construct(ControlDocenteStatsService $controlDocenteStatsService)
    {
        $this->controlDocenteStatsService = $controlDocenteStatsService;
    }

    /**
     * Retorna todas las estadísticas globales disponibles
     */
    public function getAllEstadisticas()
    {
        $controlDocente = $this->controlDocenteStatsService->getStats();

        return [
            'ok' => true,
            'message' => 'Estadísticas globales obtenidas correctamente.',
            'data' => [
                'control_docente' => $controlDocente['data'],
            ],
        ];
    }

    /**
     * Retorna solo las estadísticas de Control Docente
     */
    public function getEstadisticasControlDocente()
    {
        return $this->controlDocenteStatsService->getStats();
    }
}

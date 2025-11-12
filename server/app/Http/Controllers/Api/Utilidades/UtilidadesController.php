<?php

namespace App\Http\Controllers\Api\Utilidades;

use App\Http\Controllers\Controller;
use App\Services\Utilidades\UtilidadesService;
use Illuminate\Http\JsonResponse;

class UtilidadesController extends Controller
{
    protected $service;

    public function __construct(UtilidadesService $service)
    {
        $this->service = $service;
    }

    public function getSemestres(): JsonResponse
    {
        try {
            $result = $this->service->listarSemestres();
            return response()->json($result, 200);
        } catch (\Exception $e) {
            return response()->json([
                'ok' => false,
                'message' => 'Error al obtener los semestres',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getDocentes(): JsonResponse
    {
        try {
            $result = $this->service->listarDocentes();
            return response()->json($result, 200);
        } catch (\Exception $e) {
            return response()->json([
                'ok' => false,
                'message' => 'Error al obtener los docentes',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getAsignacionesPorDocente(string $codigo_docente): JsonResponse
    {
        try {
            $result = $this->service->listarAsignacionesPorDocente($codigo_docente);
            return response()->json($result, 200);
        } catch (\Exception $e) {
            return response()->json([
                'ok' => false,
                'message' => 'Error al obtener las asignaciones del docente',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

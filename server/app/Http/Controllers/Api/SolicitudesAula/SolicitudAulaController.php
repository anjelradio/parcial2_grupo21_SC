<?php

namespace App\Http\Controllers\Api\SolicitudesAula;

use App\Http\Controllers\Controller;
use App\Http\Requests\SolicitudesAula\UpdateSolicitudAulaRequest;
use App\Services\SolicitudesAula\SolicitudAulaService;
use App\Traits\ApiResponse;

class SolicitudAulaController extends Controller
{
    use ApiResponse;

    protected $solicitudAulaService;

    public function __construct(SolicitudAulaService $solicitudAulaService)
    {
        $this->solicitudAulaService = $solicitudAulaService;
    }

    /**
     * Listar todas las solicitudes de aula
     * (ADMIN y AUTORIDAD)
     */
    public function index()
    {
        try {
            $solicitudes = $this->solicitudAulaService->getAll();
            return $this->success($solicitudes, 'Solicitudes de aula obtenidas correctamente');
        } catch (\Exception $e) {
            return $this->error('Error al obtener las solicitudes: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Actualizar estado y observaciones de una solicitud de aula
     */
    public function update(UpdateSolicitudAulaRequest $request, $id)
    {
        try {
            $solicitud = $this->solicitudAulaService->update(
                $id,
                $request->validated(),
                $request->user()
            );

            return $this->success($solicitud, 'Solicitud de aula actualizada exitosamente');
        } catch (\Exception $e) {
            return $this->error('Error al actualizar la solicitud: ' . $e->getMessage(), 500);
        }
    }
}

<?php

namespace App\Http\Controllers\Api\GestionAcademica;

use App\Http\Controllers\Controller;
use App\Http\Requests\GestionAcademica\Dia\StoreDiaRequest;
use App\Http\Requests\GestionAcademica\Dia\UpdateDiaRequest;
use App\Services\GestionAcademica\DiaService;
use App\Traits\ApiResponse;

class DiaController extends Controller
{
    use ApiResponse;

    protected $diaService;

    public function __construct(DiaService $diaService)
    {
        $this->diaService = $diaService;
    }

    /**
     * Listar todos los días
     */
    public function index()
    {
        try {
            $dias = $this->diaService->getAll();
            return $this->success($dias, 'Días obtenidos correctamente');
        } catch (\Exception $e) {
            return $this->error('Error al obtener días: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Crear nuevo día
     */
    public function create(StoreDiaRequest $request)
    {
        try {
            $dia = $this->diaService->create($request->validated());
            return $this->success($dia, 'Día creado exitosamente', 201);
        } catch (\Exception $e) {
            return $this->error('Error al crear el día: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Actualizar día
     */
    public function update(UpdateDiaRequest $request, $id)
    {
        try {
            $dia = $this->diaService->update($id, $request->validated());
            return $this->success($dia, 'Día actualizado exitosamente');
        } catch (\Exception $e) {
            return $this->error('Error al actualizar el día: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Eliminar día
     */
    public function delete($id)
    {
        try {
            $dia = $this->diaService->delete($id);
            return $this->success($dia, 'Día eliminado exitosamente');
        } catch (\Exception $e) {
            return $this->error('Error al eliminar el día: ' . $e->getMessage(), 500);
        }
    }
}
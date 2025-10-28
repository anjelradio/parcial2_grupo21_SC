<?php

namespace App\Http\Controllers\Api\GestionAcademica;

use App\Http\Controllers\Controller;
use App\Http\Requests\GestionAcademica\Aula\StoreAulaRequest;
use App\Http\Requests\GestionAcademica\Aula\UpdateAulaRequest;
use App\Services\GestionAcademica\AulaService;
use App\Traits\ApiResponse;

class AulaController extends Controller
{
    use ApiResponse;

    protected $aulaService;

    public function __construct(AulaService $aulaService)
    {
        $this->aulaService = $aulaService;
    }

    /**
     * Listar todas las aulas
     */
    public function index()
    {
        try {
            $aulas = $this->aulaService->getAll();
            return $this->success($aulas, 'Aulas obtenidas correctamente');
        } catch (\Exception $e) {
            return $this->error('Error al obtener aulas', 500);
        }
    }

    /**
     * Crear nueva aula
     */
    public function create(StoreAulaRequest $request)
    {
        try {
            $aula = $this->aulaService->create($request->validated());
            return $this->success($aula, 'Aula creada exitosamente', 201);
        } catch (\Exception $e) {
            return $this->error('Error al crear el aula: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Actualizar aula
     */
    public function update(UpdateAulaRequest $request, $nroAula)
    {
        try {
            $aula = $this->aulaService->update($nroAula, $request->validated());
            return $this->success($aula, 'Aula actualizada exitosamente');
        } catch (\Exception $e) {
            return $this->error('Error al actualizar el aula: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Eliminar aula
     */
    public function delete($nroAula)
    {
        try {
            $aula = $this->aulaService->delete($nroAula);
            return $this->success($aula, 'Aula eliminada exitosamente');
        } catch (\Exception $e) {
            return $this->error('Error al eliminar el aula: ' . $e->getMessage(), 500);
        }
    }
}
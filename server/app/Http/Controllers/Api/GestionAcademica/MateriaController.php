<?php

namespace App\Http\Controllers\Api\GestionAcademica;

use App\Http\Controllers\Controller;
use App\Http\Requests\GestionAcademica\Materia\StoreMateriaRequest;
use App\Http\Requests\GestionAcademica\Materia\UpdateMateriaRequest;
use App\Services\GestionAcademica\MateriaService;
use App\Traits\ApiResponse;

class MateriaController extends Controller
{
    use ApiResponse;

    protected $materiaService;

    public function __construct(MateriaService $materiaService)
    {
        $this->materiaService = $materiaService;
    }

    /**
     * Listar todas las materias
     */
    public function index()
    {
        try {
            $materias = $this->materiaService->getAll();
            return $this->success($materias, 'Materias obtenidas correctamente');
        } catch (\Exception $e) {
            return $this->error('Error al obtener materias', 500);
        }
    }

    /**
     * Crear nueva materia
     */
    public function create(StoreMateriaRequest $request)
    {
        try {
            $materia = $this->materiaService->create($request->validated());
            return $this->success($materia, 'Materia creada exitosamente', 201);
        } catch (\Exception $e) {
            return $this->error('Error al crear la materia: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Actualizar materia
     */
    public function update(UpdateMateriaRequest $request, $id)
    {
        try {
            $materia = $this->materiaService->update($id, $request->validated());
            return $this->success($materia, 'Materia actualizada exitosamente');
        } catch (\Exception $e) {
            return $this->error('Error al actualizar la materia: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Eliminar materia
     */
    public function delete($id)
    {
        try {
            $materia = $this->materiaService->delete($id);
            return $this->success($materia, 'Materia eliminada exitosamente');
        } catch (\Exception $e) {
            return $this->error('Error al eliminar la materia: ' . $e->getMessage(), 500);
        }
    }
}
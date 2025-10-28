<?php

namespace App\Http\Controllers\Api\GestionAcademica;

use App\Http\Controllers\Controller;
use App\Http\Requests\GestionAcademica\BloqueHorario\StoreBloqueHorarioRequest;
use App\Http\Requests\GestionAcademica\BloqueHorario\UpdateBloqueHorarioRequest;
use App\Services\GestionAcademica\BloqueHorarioService;
use App\Traits\ApiResponse;

class BloqueHorarioController extends Controller
{
    use ApiResponse;

    protected $bloqueHorarioService;

    public function __construct(BloqueHorarioService $bloqueHorarioService)
    {
        $this->bloqueHorarioService = $bloqueHorarioService;
    }

    /**
     * Listar todos los bloques horarios
     */
    public function index()
    {
        try {
            $bloques = $this->bloqueHorarioService->getAll();
            return $this->success($bloques, 'Bloques horarios obtenidos correctamente');
        } catch (\Exception $e) {
            return $this->error('Error al obtener bloques horarios: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Crear nuevo bloque horario
     */
    public function create(StoreBloqueHorarioRequest $request)
    {
        try {
            $bloque = $this->bloqueHorarioService->create($request->validated());
            return $this->success($bloque, 'Bloque horario creado exitosamente', 201);
        } catch (\Exception $e) {
            return $this->error('Error al crear el bloque horario: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Actualizar bloque horario
     */
    public function update(UpdateBloqueHorarioRequest $request, $id)
    {
        try {
            $bloque = $this->bloqueHorarioService->update($id, $request->validated());
            return $this->success($bloque, 'Bloque horario actualizado exitosamente');
        } catch (\Exception $e) {
            return $this->error('Error al actualizar el bloque horario: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Eliminar bloque horario
     */
    public function delete($id)
    {
        try {
            $bloque = $this->bloqueHorarioService->delete($id);
            return $this->success($bloque, 'Bloque horario eliminado exitosamente');
        } catch (\Exception $e) {
            return $this->error('Error al eliminar el bloque horario: ' . $e->getMessage(), 500);
        }
    }
}
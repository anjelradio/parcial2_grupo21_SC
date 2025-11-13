<?php

namespace App\Http\Controllers\Api\Asignaciones;

use App\Http\Controllers\Controller;
use App\Http\Requests\Asignaciones\StoreAsignacionRequest;
use App\Http\Requests\Asignaciones\UpdateAsignacionRequest;
use App\Services\Asignaciones\AsignacionService;
use App\Traits\ApiResponse;

use Illuminate\Http\Request;

class AsignacionController extends Controller
{
    use ApiResponse;

    protected $asignacionService;

    public function __construct(AsignacionService $asignacionService)
    {
        $this->asignacionService = $asignacionService;
    }

    /**
     * Listar todas las asignaciones
     */
    public function index(Request $request)
    {
        try {
            $filters = [
                'page' => $request->query('page', 1),
                'page_size' => $request->query('page_size', 20),
                'id_gestion' => $request->query('id_gestion'),
                'nombre_docente' => $request->query('nombre_docente'),
                'semestre' => $request->query('semestre'),
            ];

            $data = $this->asignacionService->getAllPaginated($filters);

            return $this->success($data, 'Asignaciones obtenidas correctamente');
        } catch (\Exception $e) {
            return $this->error('Error al obtener asignaciones: ' . $e->getMessage(), 500);
        }
    }


    /**
     * Crear nueva asignación
     */
    public function create(StoreAsignacionRequest $request)
    {
        try {
            $asignacion = $this->asignacionService->create($request->validated());
            return $this->success($asignacion, 'Asignación creada exitosamente', 201);
        } catch (\Exception $e) {
            return $this->error('Error al crear la asignación: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Actualizar asignación
     */
    public function update(UpdateAsignacionRequest $request, $id)
    {
        try {
            $asignacion = $this->asignacionService->update($id, $request->validated());
            return $this->success($asignacion, 'Asignación actualizada exitosamente');
        } catch (\Exception $e) {
            return $this->error('Error al actualizar la asignación: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Eliminar asignación
     */
    public function delete($id)
    {
        try {
            $asignacion = $this->asignacionService->delete($id);
            return $this->success($asignacion, 'Asignación eliminada exitosamente');
        } catch (\Exception $e) {
            return $this->error('Error al eliminar la asignación: ' . $e->getMessage(), 500);
        }
    }
}

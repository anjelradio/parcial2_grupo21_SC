<?php

namespace App\Http\Controllers\Api\PermisosDocente;

use App\Http\Controllers\Controller;
use App\Http\Requests\PermisosDocente\UpdatePermisoDocenteRequest;
use App\Services\PermisosDocente\PermisoDocenteService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class PermisoDocenteController extends Controller
{
    use ApiResponse;

    protected $permisoDocenteService;

    public function __construct(PermisoDocenteService $permisoDocenteService)
    {
        $this->permisoDocenteService = $permisoDocenteService;
    }

    /**
     * Listar todos los permisos docentes con paginación y filtros
     * 
     * GET /api/permisos-docente
     * 
     * Parámetros query opcionales:
     * - page: número de página (default: 1)
     * - page_size: registros por página (default: 50)
     * - nombre_docente: filtrar por nombre del docente
     * - fecha: filtrar por fecha de solicitud (formato: Y-m-d)
     * - id_gestion: filtrar por gestión académica/semestre
     */
    public function index(Request $request)
    {
        try {
            // Obtener filtros del request
            $filters = [
                'page' => $request->query('page', 1),
                'page_size' => $request->query('page_size', 50),
                'nombre_docente' => $request->query('nombre_docente'),
                'fecha' => $request->query('fecha'),
                'id_gestion' => $request->query('id_gestion'),
            ];
            
            $data = $this->permisoDocenteService->getAllPaginated($filters);
            
            return $this->success($data, 'Permisos obtenidos correctamente');
        } catch (\Exception $e) {
            return $this->error('Error al obtener permisos: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Actualizar estado y observaciones de un permiso docente
     * Solo para ADMIN y AUTORIDAD
     */
    public function update(UpdatePermisoDocenteRequest $request, $id)
    {
        try {
            $permiso = $this->permisoDocenteService->update(
                $id, 
                $request->validated(),
                $request->user()
            );
            
            return $this->success($permiso, 'Permiso actualizado exitosamente');
        } catch (\Exception $e) {
            return $this->error('Error al actualizar el permiso: ' . $e->getMessage(), 500);
        }
    }
}
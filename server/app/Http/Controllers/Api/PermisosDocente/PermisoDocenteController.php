<?php

namespace App\Http\Controllers\Api\PermisosDocente;

use App\Http\Controllers\Controller;
use App\Http\Requests\PermisosDocente\UpdatePermisoDocenteRequest;
use App\Services\PermisosDocente\PermisoDocenteService;
use App\Traits\ApiResponse;

class PermisoDocenteController extends Controller
{
    use ApiResponse;

    protected $permisoDocenteService;

    public function __construct(PermisoDocenteService $permisoDocenteService)
    {
        $this->permisoDocenteService = $permisoDocenteService;
    }

    /**
     * Listar todos los permisos docentes
     * (Útil para que ADMIN y AUTORIDAD vean las solicitudes)
     */
    public function index()
    {
        try {
            $permisos = $this->permisoDocenteService->getAll();
            return $this->success($permisos, 'Permisos obtenidos correctamente');
        } catch (\Exception $e) {
            return $this->error('Error al obtener permisos', 500);
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
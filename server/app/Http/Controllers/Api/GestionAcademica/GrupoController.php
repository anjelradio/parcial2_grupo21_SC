<?php

namespace App\Http\Controllers\Api\GestionAcademica;

use App\Http\Controllers\Controller;
use App\Http\Requests\GestionAcademica\Grupos\StoreGrupoRequest;
use App\Http\Requests\GestionAcademica\Grupos\UpdateGrupoRequest;
use App\Services\GestionAcademica\GrupoService;
use App\Traits\ApiResponse;

class GrupoController extends Controller
{
    use ApiResponse;

    protected $grupoService;

    public function __construct(GrupoService $grupoService)
    {
        $this->grupoService = $grupoService;
    }

    /**
     * Listar todos los grupos
     */
    public function index()
    {
        try {
            $grupos = $this->grupoService->getAll();
            return $this->success($grupos, 'Grupos obtenidos correctamente');
        } catch (\Exception $e) {
            return $this->error('Error al obtener grupos', 500);
        }
    }

    /**
     * Crear nuevo grupo
     */
    public function create(StoreGrupoRequest $request)
    {
        try {
            $grupo = $this->grupoService->create($request->validated());
            return $this->success($grupo, 'Grupo creado exitosamente', 201);
        } catch (\Exception $e) {
            return $this->error('Error al crear el grupo: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Actualizar grupo
     */
    public function update(UpdateGrupoRequest $request, $id)
    {
        try {
            $grupo = $this->grupoService->update($id, $request->validated());
            return $this->success($grupo, 'Grupo actualizado exitosamente');
        } catch (\Exception $e) {
            return $this->error('Error al actualizar el grupo: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Eliminar grupo
     */
    public function delete($id)
    {
        try {
            $grupo = $this->grupoService->delete($id);
            return $this->success($grupo, 'Grupo eliminado exitosamente');
        } catch (\Exception $e) {
            return $this->error('Error al eliminar el grupo: ' . $e->getMessage(), 500);
        }
    }
}
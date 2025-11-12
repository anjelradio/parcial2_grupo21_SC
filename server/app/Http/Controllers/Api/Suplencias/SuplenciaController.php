<?php

namespace App\Http\Controllers\Api\Suplencias;

use App\Http\Controllers\Controller;
use App\Http\Requests\Suplencias\StoreSuplenciaRequest;
use App\Http\Requests\Suplencias\UpdateSuplenciaRequest;
use App\Services\Suplencias\SuplenciaService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class SuplenciaController extends Controller
{
    use ApiResponse;

    protected $suplenciaService;

    public function __construct(SuplenciaService $suplenciaService)
    {
        $this->suplenciaService = $suplenciaService;
    }

    /**
     * Listar suplencias con paginación y filtros
     * (ADMIN y AUTORIDAD)
     */
    public function index(Request $request)
    {
        try {
            $filters = [
                'page' => $request->query('page', 1),
                'page_size' => $request->query('page_size', 10),
                'nombre_titular' => $request->query('nombre_titular'),
                'id_gestion' => $request->query('id_gestion'),
            ];

            $data = $this->suplenciaService->getAllPaginated($filters);

            return $this->success($data, 'Suplencias obtenidas correctamente');
        } catch (\Exception $e) {
            return $this->error('Error al obtener las suplencias: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Crear nueva suplencia
     */
    public function create(StoreSuplenciaRequest $request)
    {
        try {
            $suplencia = $this->suplenciaService->create($request->validated());
            return $this->success($suplencia, 'Suplencia creada exitosamente', 201);
        } catch (\Exception $e) {
            return $this->error('Error al crear la suplencia: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Actualizar suplencia existente
     */
    public function update(UpdateSuplenciaRequest $request, $id)
    {
        try {
            $suplencia = $this->suplenciaService->update($id, $request->validated());
            return $this->success($suplencia, 'Suplencia actualizada exitosamente');
        } catch (\Exception $e) {
            return $this->error('Error al actualizar la suplencia: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Eliminar suplencia
     */
    public function delete($id)
    {
        try {
            $suplencia = $this->suplenciaService->delete($id);
            return $this->success($suplencia, 'Suplencia eliminada exitosamente');
        } catch (\Exception $e) {
            return $this->error('Error al eliminar la suplencia: ' . $e->getMessage(), 500);
        }
    }
}

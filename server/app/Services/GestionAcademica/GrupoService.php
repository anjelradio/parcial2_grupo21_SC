<?php

namespace App\Services\GestionAcademica;

use App\Models\Grupo;
use Illuminate\Support\Facades\DB;

class GrupoService
{
    /**
     * Obtener todos los grupos con su materia
     */
    public function getAll()
    {
        return Grupo::with('materia')->get()->map(function ($grupo) {
            return $this->formatGrupoData($grupo);
        });
    }

    /**
     * Crear nuevo grupo
     */
    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            $grupo = Grupo::create([
                'nombre' => $data['nombre'],
                'id_materia' => $data['id_materia'],
            ]);

            return $this->formatGrupoData($grupo->load('materia'));
        });
    }

    /**
     * Actualizar grupo
     */
    public function update($id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $grupo = Grupo::findOrFail($id);
            
            $grupo->update([
                'nombre' => $data['nombre'],
                'id_materia' => $data['id_materia'],
            ]);

            return $this->formatGrupoData($grupo->fresh('materia'));
        });
    }

    /**
     * Eliminar grupo
     */
    public function delete($id)
    {
        return DB::transaction(function () use ($id) {
            $grupo = Grupo::with('materia')->findOrFail($id);
            $grupoData = $this->formatGrupoData($grupo);
            
            $grupo->delete();
            
            return $grupoData;
        });
    }

    /**
     * Formatear datos del grupo
     */
    private function formatGrupoData(Grupo $grupo)
    {
        return [
            'id_grupo' => $grupo->id_grupo,
            'nombre' => $grupo->nombre,
            'id_materia' => $grupo->id_materia,
            'sigla_materia' => $grupo->materia?->sigla,
            'nombre_materia' => $grupo->materia?->nombre,
        ];
    }
}
<?php

namespace App\Services\GestionAcademica;

use App\Models\Materia;
use Illuminate\Support\Facades\DB;

class MateriaService
{
    /**
     * Obtener todas las materias
     */
    public function getAll()
    {
        return Materia::all()->map(function ($materia) {
            return $this->formatMateriaData($materia);
        });
    }

    /**
     * Crear nueva materia
     */
    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            $materia = Materia::create([
                'sigla' => $data['sigla'],
                'nombre' => $data['nombre'],
            ]);

            return $this->formatMateriaData($materia);
        });
    }

    /**
     * Actualizar materia
     */
    public function update($id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $materia = Materia::findOrFail($id);
            
            $materia->update([
                'sigla' => $data['sigla'],
                'nombre' => $data['nombre'],
            ]);

            return $this->formatMateriaData($materia->fresh());
        });
    }

    /**
     * Eliminar materia
     */
    public function delete($id)
    {
        return DB::transaction(function () use ($id) {
            $materia = Materia::findOrFail($id);
            $materiaData = $this->formatMateriaData($materia);
            
            $materia->delete();
            
            return $materiaData;
        });
    }

    /**
     * Formatear datos de la materia
     */
    private function formatMateriaData(Materia $materia)
    {
        return [
            'id_materia' => $materia->id_materia,
            'sigla' => $materia->sigla,
            'nombre' => $materia->nombre,
        ];
    }
}
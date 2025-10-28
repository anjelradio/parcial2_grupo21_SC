<?php

namespace App\Services\GestionAcademica;

use App\Models\Aula;
use Illuminate\Support\Facades\DB;

class AulaService
{
    /**
     * Obtener todas las aulas
     */
    public function getAll()
    {
        return Aula::all()->map(function ($aula) {
            return $this->formatAulaData($aula);
        });
    }

    /**
     * Crear nueva aula
     */
    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            $aula = Aula::create([
                'nro_aula' => $data['nro_aula'],
                'tipo' => $data['tipo'],
                'capacidad' => $data['capacidad'],
                'estado' => $data['estado'],
            ]);

            return $this->formatAulaData($aula);
        });
    }

    /**
     * Actualizar aula
     */
    public function update($nroAula, array $data)
    {
        return DB::transaction(function () use ($nroAula, $data) {
            $aula = Aula::findOrFail($nroAula);
            
            $aula->update([
                'nro_aula' => $data['nro_aula'],
                'tipo' => $data['tipo'],
                'capacidad' => $data['capacidad'],
                'estado' => $data['estado'],
            ]);

            return $this->formatAulaData($aula->fresh());
        });
    }

    /**
     * Eliminar aula
     */
    public function delete($nroAula)
    {
        return DB::transaction(function () use ($nroAula) {
            $aula = Aula::findOrFail($nroAula);
            $aulaData = $this->formatAulaData($aula);
            
            $aula->delete();
            
            return $aulaData;
        });
    }

    /**
     * Formatear datos del aula
     */
    private function formatAulaData(Aula $aula)
    {
        return [
            'nro_aula' => $aula->nro_aula,
            'tipo' => $aula->tipo,
            'capacidad' => $aula->capacidad,
            'estado' => $aula->estado,
        ];
    }
}
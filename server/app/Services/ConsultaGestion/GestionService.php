<?php

namespace App\Services\ConsultaGestion;

use App\Models\GestionAcademica;

class GestionService
{
    /**
     * Devuelve todas las gestiones académicas registradas
     */
    public function obtenerGestiones()
    {
        return GestionAcademica::select(
            'id_gestion',
            'anio',
            'semestre',
            'fecha_inicio',
            'fecha_fin'
        )
        ->orderByDesc('anio')
        ->orderByDesc('semestre')
        ->get()
        ->map(function ($gestion) {
            return [
                'id_gestion' => $gestion->id_gestion,
                'anio' => $gestion->anio,
                'semestre' => $gestion->semestre,
                'fecha_inicio' => $gestion->fecha_inicio->format('Y-m-d'),
                'fecha_fin' => $gestion->fecha_fin->format('Y-m-d'),
                'descripcion' => $gestion->descripcion(),
                'vigente' => $gestion->esVigente(),
            ];
        });
    }
}

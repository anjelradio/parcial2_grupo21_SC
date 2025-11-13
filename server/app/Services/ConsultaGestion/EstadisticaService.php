<?php

namespace App\Services\ConsultaGestion;

use App\Models\Asignacion;
use Illuminate\Support\Facades\DB;

class EstadisticaService
{
    /**
     * Calcula las estadísticas globales de una gestión
     */
    public function calcularEstadisticas($id_gestion)
    {
        // 1️⃣ Filtrar las asignaciones de esa gestión
        $asignaciones = Asignacion::with(['grupo.materia'])
            ->where('id_gestion', $id_gestion)
            ->where('estado', 'Vigente') // solo las activas
            ->get();

        if ($asignaciones->isEmpty()) {
            return [
                'total_docentes_activos' => 0,
                'total_grupos_activos' => 0,
                'total_materias_activas' => 0,
            ];
        }

        // 2️⃣ Calcular los totales únicos
        $docentesUnicos = $asignaciones->pluck('codigo_docente')->unique()->count();
        $gruposUnicos = $asignaciones->pluck('id_grupo')->unique()->count();

        // extraer materias desde los grupos relacionados
        $materiasUnicas = $asignaciones
            ->pluck('grupo.materia.id_materia')
            ->filter()
            ->unique()
            ->count();

        return [
            'total_docentes_activos' => $docentesUnicos,
            'total_grupos_activos' => $gruposUnicos,
            'total_materias_activas' => $materiasUnicas,
        ];
    }
}

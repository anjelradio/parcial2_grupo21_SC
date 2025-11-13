<?php

namespace App\Services\SupervisionAsistencias;

use App\Models\Asignacion;
use App\Models\GestionAcademica;

class EstadisticaService
{
    /**
     * Calcula estadísticas globales de asistencia de una gestión.
     */
    public function calcularEstadisticas($id_gestion = null)
    {
        // 1️⃣ Obtener gestión actual o la enviada
        $gestion = $id_gestion
            ? GestionAcademica::find($id_gestion)
            : GestionAcademica::where('estado', 'VIGENTE')->first();

        if (!$gestion) {
            throw new \Exception("No se encontró la gestión académica.");
        }

        // 2️⃣ Obtener asignaciones de esa gestión
        $asignaciones = Asignacion::with([
            'asistencias.tipoAsistencia',
            'docente',
        ])
        ->where('id_gestion', $gestion->id_gestion)
        ->where('estado', 'Vigente') // coherente con tu tabla
        ->get();

        if ($asignaciones->isEmpty()) {
            return $this->respuestaVacia();
        }

        // 3️⃣ Obtener todas las asistencias enlazadas
        $asistencias = $asignaciones->flatMap->asistencias;

        // 4️⃣ Contador global por estado
        $totalMarcadas = $asistencias->where('estado', 'Presente')->count();
        $totalAusentes = $asistencias->where('estado', 'Ausente')->count();
        $totalRetrasos = $asistencias->where('estado', 'Retraso')->count();

        // Se ignora licencia en tasa de cumplimiento
        $totalRegistros = $totalMarcadas + $totalAusentes + $totalRetrasos;

        $tasaCumplimiento = $totalRegistros > 0
            ? round(($totalMarcadas / $totalRegistros) * 100, 2)
            : 0;

        // 5️⃣ Distribución presencial/virtual
        $presencial = $asistencias->filter(fn($a) =>
            $a->tipoAsistencia?->nombre === 'Presencial'
        );

        $virtual = $asistencias->filter(fn($a) =>
            $a->tipoAsistencia?->nombre === 'Virtual'
        );

        $totalAsistencias = max(($presencial->count() + $virtual->count()), 1);

        $distribucion = [
            'presencial' => [
                'cantidad' => $presencial->count(),
                'porcentaje' => round(($presencial->count() / $totalAsistencias) * 100, 2),
            ],
            'virtual' => [
                'cantidad' => $virtual->count(),
                'porcentaje' => round(($virtual->count() / $totalAsistencias) * 100, 2),
            ],
        ];

        // 6️⃣ Devolver solo estadísticas
        return [
            'estadisticas' => [
                'tasa_cumplimiento_global' => $tasaCumplimiento,

                'total_asistencias_marcadas' => $totalMarcadas,
                'total_ausentes' => $totalAusentes,
                'total_retrasos' => $totalRetrasos,

                'resumen_general' => [
                    'total_asignaciones' => $asignaciones->count(),
                    'total_docentes' => $asignaciones->pluck('codigo_docente')->unique()->count(),
                    'distribucion_asistencias' => $distribucion,
                ],
            ],

            'gestion' => [
                'id_gestion' => $gestion->id_gestion,
                'descripcion' => "{$gestion->anio}-{$gestion->semestre}",
            ],
        ];
    }

    private function respuestaVacia()
    {
        return [
            'estadisticas' => [
                'tasa_cumplimiento_global' => 0,
                'total_asistencias_marcadas' => 0,
                'total_ausentes' => 0,
                'total_retrasos' => 0,

                'resumen_general' => [
                    'total_asignaciones' => 0,
                    'total_docentes' => 0,
                    'distribucion_asistencias' => [
                        'presencial' => ['cantidad' => 0, 'porcentaje' => 0],
                        'virtual' => ['cantidad' => 0, 'porcentaje' => 0],
                    ],
                ],
            ],
            'gestion' => null,
        ];
    }
}

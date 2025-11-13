<?php

namespace App\Services\SupervisionAsistencias;

use App\Models\Asignacion;

class AsignacionDetalleService
{
    /**
     * Detalle completo y estadísticas de una asignación.
     */
    public function obtenerDetalleAsignacion($id_asignacion)
    {
        // 1️⃣ Obtener asignación y sus relaciones
        $asignacion = Asignacion::with([
            'docente.user',
            'grupo.materia',
            'gestion',
            'asistencias.tipoAsistencia'
        ])->find($id_asignacion);

        if (!$asignacion) {
            throw new \Exception("No se encontró la asignación.");
        }

        // 2️⃣ Asistencias de la asignación
        $asistencias = $asignacion->asistencias;

        // 3️⃣ Estadísticas
        $total = $asistencias->count();
        $totalPresente = $asistencias->where('estado', 'Presente')->count();
        $totalAusente = $asistencias->where('estado', 'Ausente')->count();
        $totalRetraso = $asistencias->where('estado', 'Retraso')->count();

        $tasaCumplimiento = $total > 0
            ? round(($totalPresente / $total) * 100, 2)
            : 0;

        // 4️⃣ Distribución por tipo de asistencia
        $presencial = $asistencias->filter(fn($a) =>
            $a->tipoAsistencia?->nombre === 'Presencial'
        );
        $virtual = $asistencias->filter(fn($a) =>
            $a->tipoAsistencia?->nombre === 'Virtual'
        );

        $totalTipo = max(($presencial->count() + $virtual->count()), 1);

        $distribucion = [
            'presencial' => [
                'cantidad' => $presencial->count(),
                'porcentaje' => round(($presencial->count() / $totalTipo) * 100, 2),
            ],
            'virtual' => [
                'cantidad' => $virtual->count(),
                'porcentaje' => round(($virtual->count() / $totalTipo) * 100, 2),
            ],
        ];

        // 5️⃣ Listado de asistencias formateado
        $lista = $asistencias->map(function ($a) {
            return [
                'fecha' => $a->fecha,
                'hora_registro' => $a->hora_registro,
                'estado' => $a->estado,
                'tipo_asistencia' => $a->tipoAsistencia?->nombre ?? '',
            ];
        });

        // 6️⃣ INFORMACIÓN FINAL (lista + estadísticas + información de la asignación)
        return [
            'info_asignacion' => [
                'id_asignacion' => $asignacion->id_asignacion,
                'docente' => $asignacion->docente?->user?->nombre_completo ?? '',
                'profesion' => $asignacion->docente?->profesion ?? '',
                'materia' => $asignacion->grupo?->materia?->nombre ?? '',
                'sigla' => $asignacion->grupo?->materia?->sigla ?? '',
                'grupo' => $asignacion->grupo?->nombre ?? '',
                'gestion' => "{$asignacion->gestion->anio}-{$asignacion->gestion->semestre}",
            ],

            'estadisticas' => [
                'total_asistencias' => $total,
                'total_presentes' => $totalPresente,
                'total_ausentes' => $totalAusente,
                'total_retrasos' => $totalRetraso,
                'tasa_cumplimiento' => $tasaCumplimiento,
                'distribucion_tipos' => $distribucion,
            ],

            'asistencias' => $lista,
        ];
    }
}

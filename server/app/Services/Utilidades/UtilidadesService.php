<?php

namespace App\Services\Utilidades;

use App\Models\GestionAcademica;
use App\Models\Docente;
use App\Models\Asignacion;
use Carbon\Carbon;

class UtilidadesService
{
    public function listarSemestres()
    {
        $semestres = GestionAcademica::orderByDesc('anio')
            ->orderByDesc('semestre')
            ->get()
            ->map(function ($gestion) {
                return [
                    'id_gestion' => $gestion->id_gestion,
                    'nombre' => $gestion->descripcion, 
                    'fecha_inicio' => $gestion->fecha_inicio->toDateString(),
                    'fecha_fin' => $gestion->fecha_fin->toDateString(),
                ];
            });

        return [
            'ok' => true,
            'message' => 'Lista de semestres obtenida correctamente',
            'data' => [
                'semestres' => $semestres,
            ],
        ];
    }

    public function listarDocentes()
    {
        $docentes = Docente::with('user') // cargamos relación user
            ->orderBy('codigo_docente', 'asc')
            ->get()
            ->map(function ($docente) {
                return [
                    'id_docente' => $docente->codigo_docente, // clave primaria de docente
                    'codigo_docente' => $docente->codigo_docente,
                    'user_id' => $docente->user_id,
                    'nombre_completo' => $docente->user?->nombre_completo ?? 'Desconocido',
                    'profesion' => $docente->profesion ?? 'N/A',
                    'email' => $docente->user?->email ?? null,
                ];
            });

        return [
            'ok' => true,
            'message' => 'Lista de docentes obtenida correctamente',
            'data' => [
                'docentes' => $docentes,
            ],
        ];
    }

    public function listarAsignacionesPorDocente(string $codigo_docente)
    {
        // === Obtener la gestión académica actual ===
        $hoy = Carbon::now()->toDateString();

        $gestionActual = GestionAcademica::whereDate('fecha_inicio', '<=', $hoy)
            ->whereDate('fecha_fin', '>=', $hoy)
            ->first();

        if (!$gestionActual) {
            return [
                'ok' => false,
                'message' => 'No se encontró una gestión académica activa para la fecha actual.',
                'data' => null,
            ];
        }

        // === Buscar las asignaciones del docente en la gestión actual ===
        $asignaciones = Asignacion::with(['grupo.materia', 'docente.user'])
            ->where('codigo_docente', $codigo_docente)
            ->where('id_gestion', $gestionActual->id_gestion)
            ->get()
            ->map(function ($asignacion) {
                return [
                    'id_asignacion' => $asignacion->id_asignacion,
                    'descripcion' => $asignacion->GrupoMateria(), // usa el helper del modelo
                ];
            });

        if ($asignaciones->isEmpty()) {
            return [
                'ok' => true,
                'message' => 'El docente no tiene asignaciones vigentes en la gestión actual.',
                'data' => [
                    'asignaciones' => [],
                ],
            ];
        }

        return [
            'ok' => true,
            'message' => 'Asignaciones obtenidas correctamente.',
            'data' => [
                'gestion_actual' => "{$gestionActual->anio}-{$gestionActual->semestre}",
                'asignaciones' => $asignaciones,
            ],
        ];
    }
}

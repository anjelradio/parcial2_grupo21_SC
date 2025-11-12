<?php

namespace App\Services\Estadisticas;

use App\Models\PermisoDocente;
use App\Models\SolicitudAula;
use App\Models\Suplencia;
use App\Models\GestionAcademica;
use Carbon\Carbon;

class ControlDocenteStatsService
{
    /**
     * Obtiene las estadísticas del módulo Control Docente
     * (Permisos, Solicitudes de aula y Suplencias)
     */
    public function getStats()
    {
        $hoy = Carbon::now()->toDateString();

        $gestionActual = GestionAcademica::whereDate('fecha_inicio', '<=', $hoy)
            ->whereDate('fecha_fin', '>=', $hoy)
            ->first();

        if (!$gestionActual) {
            return [
                'ok' => false,
                'message' => 'No se encontró la gestión académica actual.',
                'data' => null,
            ];
        }

        // === PERMISOS DOCENTES ===
        $permisos = [
            'pendientes' => PermisoDocente::where('estado', 'Pendiente')->count() ?? 0,
            'aprobados'  => PermisoDocente::where('estado', 'Aprobado')->count() ?? 0,
            'rechazados' => PermisoDocente::where('estado', 'Rechazado')->count() ?? 0,
        ];
        $permisos['total'] = array_sum($permisos);

        // === SOLICITUDES DE AULA ===
        $solicitudes = [
            'pendientes' => SolicitudAula::where('estado', 'Pendiente')->count() ?? 0,
            'aprobadas'  => SolicitudAula::where('estado', 'Aprobada')->count() ?? 0,
            'rechazadas' => SolicitudAula::where('estado', 'Rechazada')->count() ?? 0,
        ];
        $solicitudes['total'] = array_sum($solicitudes);

        // === SUPLENCIAS ===
        $suplencias = [
            'activas'     => Suplencia::where('estado', 'Activa')->count() ?? 0,
            'finalizadas' => Suplencia::where('estado', 'Finalizada')->count() ?? 0,
            'canceladas'  => Suplencia::where('estado', 'Cancelada')->count() ?? 0,
        ];
        $suplencias['total'] = array_sum($suplencias);

        return [
            'ok' => true,
            'message' => 'Estadísticas de Control Docente obtenidas correctamente.',
            'data' => [
                'gestion_actual' => $gestionActual->nombre_gestion,
                'permisos' => $permisos,
                'solicitudes_aula' => $solicitudes,
                'suplencias' => $suplencias,
            ],
        ];
    }
}

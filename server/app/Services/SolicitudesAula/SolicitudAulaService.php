<?php

namespace App\Services\SolicitudesAula;

use App\Models\SolicitudAula;
use App\Models\Bitacora;
use App\Models\User;
use App\Models\GestionAcademica;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SolicitudAulaService
{
    /**
     * Obtener solicitudes con paginación y filtros.
     */
    public function getAllPaginated(array $filters = [])
    {
        $page = $filters['page'] ?? 1;
        $pageSize = $filters['page_size'] ?? 50;

        $query = SolicitudAula::with([
            'aula',
            'asignacion.docente.user', // para obtener nombre del docente
        ])->orderByDesc('fecha_solicitud');

        // Aplicar filtros dinámicos
        $this->applyFilters($query, $filters);

        // Total de registros
        $total = $query->count();
        $totalPaginas = ceil($total / $pageSize);

        // Obtener datos paginados
        $solicitudes = $query->skip(($page - 1) * $pageSize)
            ->take($pageSize)
            ->get()
            ->map(fn($s) => $this->formatSolicitudData($s));

        return [
            'solicitudes' => $solicitudes,
            'paginacion' => [
                'total_registros' => $total,
                'total_paginas' => $totalPaginas,
                'pagina_actual' => (int) $page,
                'registros_por_pagina' => (int) $pageSize,
                'tiene_siguiente' => $page < $totalPaginas,
                'tiene_anterior' => $page > 1,
            ],
            'filtros_aplicados' => [
                'nombre_docente' => $filters['nombre_docente'] ?? null,
                'fecha' => $filters['fecha'] ?? null,
                'id_gestion' => $filters['id_gestion'] ?? null,
            ],
        ];
    }

    /**
     * Aplicar filtros
     */
    private function applyFilters($query, array $filters)
    {
        // Filtro por nombre de docente
        if (!empty($filters['nombre_docente'])) {
            $nombre = $filters['nombre_docente'];
            $query->whereHas('asignacion.docente.user', function ($q) use ($nombre) {
                $q->where(DB::raw("CONCAT(nombre, ' ', apellido_paterno, ' ', apellido_materno)"), 'LIKE', "%{$nombre}%");
            });
        }

        // Filtro por fecha solicitada
        if (!empty($filters['fecha'])) {
            $query->whereDate('fecha_solicitada', $filters['fecha']);
        }

        // Filtro por gestión académica (semestre)
        if (!empty($filters['id_gestion'])) {
            // Si se envía explícitamente, usar esa gestión
            $gestion = GestionAcademica::find($filters['id_gestion']);
        } else {
            // Si no se envía, obtener la gestión académica actual (basada en fecha)
            $gestion = GestionAcademica::where('fecha_inicio', '<=', now())
                ->where('fecha_fin', '>=', now())
                ->first();
        }
    }

    /**
     * Actualizar estado y observaciones
     */
    public function update($id, array $data, User $userRevisor)
    {
        return DB::transaction(function () use ($id, $data, $userRevisor) {
            $solicitud = SolicitudAula::with(['asignacion.docente.user', 'aula'])->findOrFail($id);
            $estadoAnterior = $solicitud->estado;

            $solicitud->update([
                'estado' => $data['estado'],
                'observaciones' => $data['observaciones'] ?? $solicitud->observaciones,
            ]);

            $this->registrarEnBitacora($solicitud, $estadoAnterior, $userRevisor);

            return $this->formatSolicitudData($solicitud->fresh(['asignacion.docente.user', 'aula']));
        });
    }

    private function registrarEnBitacora(SolicitudAula $solicitud, string $estadoAnterior, User $userRevisor)
    {
        Bitacora::create([
            'user_id' => $userRevisor->id,
            'accion' => 'Actualización de estado de solicitud de aula',
            'detalles' => json_encode([
                'id_solicitud' => $solicitud->id_solicitud,
                'estado_anterior' => $estadoAnterior,
                'estado_nuevo' => $solicitud->estado,
                'observaciones' => $solicitud->observaciones,
            ]),
            'fecha' => Carbon::now(),
        ]);
    }

    /**
     * Formatear datos de solicitud
     */
    private function formatSolicitudData(SolicitudAula $s)
    {
        $docente = $s->asignacion?->docente?->user;

        return [
            'id_solicitud' => $s->id_solicitud,
            'nombre_docente' => $docente
                ? "{$docente->nombre} {$docente->apellido_paterno} {$docente->apellido_materno}"
                : null,
            'codigo_docente' => $s->asignacion?->codigo_docente,
            'nro_aula' => $s->nro_aula,
            'aula' => $s->aula?->tipo,
            'fecha_solicitada' => $s->fecha_solicitada?->format('Y-m-d'),
            'motivo' => $s->motivo,
            'estado' => $s->estado,
            'fecha_solicitud' => $s->fecha_solicitud?->format('Y-m-d H:i'),
            'observaciones' => $s->observaciones,
        ];
    }
}

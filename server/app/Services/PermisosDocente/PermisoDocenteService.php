<?php

namespace App\Services\PermisosDocente;

use App\Models\PermisoDocente;
use App\Models\Bitacora;
use App\Models\User;
use App\Models\GestionAcademica;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PermisoDocenteService
{
    /**
     * Obtener permisos con paginación y filtros
     * 
     * @param array $filters
     * @return array
     */
    public function getAllPaginated(array $filters = [])
    {
        // Parámetros de paginación
        $page = $filters['page'] ?? 1;
        $pageSize = $filters['page_size'] ?? 50;

        // Construir query base con relaciones
        $query = PermisoDocente::with('docente.user')
            ->orderBy('fecha_solicitud', 'desc');

        // Aplicar filtros
        $this->applyFilters($query, $filters);

        // Contar total de registros
        $totalRegistros = $query->count();

        // Calcular total de páginas
        $totalPaginas = ceil($totalRegistros / $pageSize);

        // Obtener registros paginados
        $permisos = $query->skip(($page - 1) * $pageSize)
            ->take($pageSize)
            ->get()
            ->map(function ($permiso) {
                return $this->formatPermisoData($permiso);
            });

        // Preparar respuesta con estructura solicitada
        return [
            'permisos' => $permisos,
            'paginacion' => [
                'total_registros' => $totalRegistros,
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
            ]
        ];
    }

    /**
     * Aplicar filtros a la query
     * 
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param array $filters
     */
    private function applyFilters($query, array $filters)
    {
        // Filtro por nombre de docente
        if (!empty($filters['nombre_docente'])) {
            $search = strtolower($filters['nombre_docente']);
            $query->whereHas('docente.user', function ($q) use ($search) {
                $q->whereRaw("LOWER(CONCAT(nombre, ' ', apellido_paterno, ' ', apellido_materno)) LIKE ?", ["%{$search}%"]);
            });
        }

        // Filtro por fecha de solicitud
        if (!empty($filters['fecha'])) {
            $fecha = $filters['fecha'];
            $query->whereDate('fecha_solicitud', $fecha);
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

        if ($gestion) {
            $query->whereBetween('fecha_solicitud', [
                $gestion->fecha_inicio,
                $gestion->fecha_fin
            ]);
        } else {
            // Si no hay gestión actual, devolver una colección vacía
            $query->whereRaw('1 = 0');
        }
    }

    /**
     * Obtener todos los permisos (método anterior, mantenerlo por compatibilidad)
     */
    public function getAll()
    {
        return PermisoDocente::with('docente.user')->get()->map(function ($permiso) {
            return $this->formatPermisoData($permiso);
        });
    }

    /**
     * Actualizar estado y observaciones de un permiso
     */
    public function update($id, array $data, User $userRevisor)
    {
        return DB::transaction(function () use ($id, $data, $userRevisor) {
            $permiso = PermisoDocente::with('docente.user')->findOrFail($id);

            // Guardar estado anterior para la bitácora
            $estadoAnterior = $permiso->estado;

            // Actualizar permiso
            $permiso->update([
                'estado' => $data['estado'],
                'observaciones' => $data['observaciones'] ?? $permiso->observaciones,
                'fecha_revision' => Carbon::now()->toDateString(),
            ]);

            // Registrar en bitácora
            $this->registrarEnBitacora($permiso, $estadoAnterior, $userRevisor);

            return $this->formatPermisoData($permiso->fresh('docente.user'));
        });
    }

    /**
     * Registrar la acción en la bitácora
     */
    private function registrarEnBitacora(PermisoDocente $permiso, string $estadoAnterior, User $userRevisor)
    {
        $docente = $permiso->docente->user;

        Bitacora::create([
            'user_id' => $userRevisor->id,
            'accion' => 'Actualización de estado de permiso docente',
            'detalles' => json_encode([
                'id_permiso' => $permiso->id_permiso,
                'docente' => $docente->nombre_completo,
                'codigo_docente' => $permiso->codigo_docente,
                'estado_anterior' => $estadoAnterior,
                'estado_nuevo' => $permiso->estado,
                'observaciones' => $permiso->observaciones,
                'fecha_revision' => $permiso->fecha_revision,
            ]),
            'fecha' => Carbon::now(),
        ]);
    }

    /**
     * Formatear datos del permiso para la respuesta
     */
    private function formatPermisoData(PermisoDocente $permiso)
    {
        $docente = $permiso->docente;
        $user = $docente?->user;

        return [
            'id_permiso' => $permiso->id_permiso,
            'codigo_docente' => $permiso->codigo_docente,
            'nombre_docente' => $user?->nombre_completo,
            'documento_evidencia' => $permiso->documento_evidencia,
            'fecha_inicio' => $permiso->fecha_inicio?->format('Y-m-d'),
            'fecha_fin' => $permiso->fecha_fin?->format('Y-m-d'),
            'motivo' => $permiso->motivo,
            'estado' => $permiso->estado,
            'fecha_solicitud' => $permiso->fecha_solicitud?->format('Y-m-d'),
            'fecha_revision' => $permiso->fecha_revision?->format('Y-m-d'),
            'observaciones' => $permiso->observaciones,
        ];
    }
}

<?php

namespace App\Services\ConsultaGestion;

use App\Models\Asignacion;

class GrupoMateriaService
{
    /**
     * Retorna los grupos activos (con su materia) de una gestión, con paginación y filtro.
     */
    public function getGruposActivos($id_gestion, array $filters = [])
    {
        $page = (int)($filters['page'] ?? 1);
        $pageSize = (int)($filters['page_size'] ?? 20);
        $search = strtolower(trim($filters['search'] ?? ''));

        // Query base: asignaciones vigentes de la gestión
        $query = Asignacion::with(['grupo.materia'])
            ->where('id_gestion', $id_gestion)
            ->where('estado', 'Vigente')
            ->whereHas('grupo.materia');

        // Filtro por materia o grupo
        if (!empty($search)) {
            $query->whereHas('grupo.materia', function ($q) use ($search) {
                $q->whereRaw('LOWER(nombre) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(sigla) LIKE ?', ["%{$search}%"]);
            })->orWhereHas('grupo', function ($q) use ($search) {
                $q->whereRaw('LOWER(nombre) LIKE ?', ["%{$search}%"]);
            });
        }

        $asignaciones = $query->get()->unique('id_grupo')->values();

        $totalRegistros = $asignaciones->count();
        $totalPaginas = ceil($totalRegistros / $pageSize);

        $paginados = $asignaciones->forPage($page, $pageSize)->map(function ($asignacion) {
            $grupo = $asignacion->grupo;
            $materia = $grupo?->materia;

            return [
                'id_grupo' => $grupo?->id_grupo,
                'nombre_grupo' => $grupo?->nombre,
                'sigla_materia' => $materia?->sigla,
                'nombre_materia' => $materia?->nombre,
            ];
        })
            ->values();

        return [
            'grupos_materias' => $paginados,
            'paginacion' => [
                'total_registros' => $totalRegistros,
                'total_paginas' => $totalPaginas,
                'pagina_actual' => $page,
                'registros_por_pagina' => $pageSize,
                'tiene_siguiente' => $page < $totalPaginas,
                'tiene_anterior' => $page > 1,
            ],
            'filtros_aplicados' => [
                'search' => $search ?: null,
            ],
        ];
    }
    public function getAllGruposActivos($id_gestion, $filtros = [])
    {
        $search = strtolower(trim($filtros['search'] ?? ''));

        $query = Asignacion::with(['grupo.materia'])
            ->where('id_gestion', $id_gestion)
            ->where('estado', 'Vigente')
            ->whereHas('grupo.materia');

        if (!empty($search)) {
            $query->where(function ($sub) use ($search) {
                $sub->whereHas('grupo', function ($q) use ($search) {
                    $q->whereRaw('LOWER(nombre) LIKE ?', ["%{$search}%"]);
                })
                    ->orWhereHas('grupo.materia', function ($q) use ($search) {
                        $q->whereRaw('LOWER(nombre) LIKE ?', ["%{$search}%"])
                            ->orWhereRaw('LOWER(sigla) LIKE ?', ["%{$search}%"]);
                    });
            });
        }

        return $query->get()
            ->unique('id_grupo')
            ->map(function ($asignacion) {
                $grupo = $asignacion->grupo;
                $materia = $grupo?->materia;

                return [
                    'id_grupo' => $grupo?->id_grupo,
                    'nombre_grupo' => $grupo?->nombre,
                    'sigla_materia' => $materia?->sigla,
                    'nombre_materia' => $materia?->nombre,
                ];
            })
            ->values()
            ->toArray();
    }
}

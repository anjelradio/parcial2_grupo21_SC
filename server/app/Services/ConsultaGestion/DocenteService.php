<?php

namespace App\Services\ConsultaGestion;

use App\Models\Asignacion;

class DocenteService
{
    /**
     * Retorna los docentes activos (únicos) de una gestión con paginación y búsqueda.
     */
    public function getDocentesActivos($id_gestion, array $filters = [])
    {
        $page = (int)($filters['page'] ?? 1);
        $pageSize = (int)($filters['page_size'] ?? 20);
        $nombreDocente = strtolower(trim($filters['nombre_docente'] ?? ''));

        // Query base: docentes con asignaciones vigentes de la gestión
        $query = Asignacion::with(['docente.user'])
            ->where('id_gestion', $id_gestion)
            ->where('estado', 'Vigente')
            ->whereHas('docente.user');

        // Filtro por nombre de docente
        if (!empty($nombreDocente)) {
            $query->whereHas('docente.user', function ($q) use ($nombreDocente) {
                $q->whereRaw(
                    "LOWER(CONCAT(nombre, ' ', apellido_paterno, ' ', apellido_materno)) LIKE ?",
                    ["%{$nombreDocente}%"]
                );
            });
        }

        // Obtener docentes únicos
        $docentes = $query->get()
            ->unique('codigo_docente')
            ->values();

        $totalRegistros = $docentes->count();
        $totalPaginas = ceil($totalRegistros / $pageSize);

        $paginados = $docentes->forPage($page, $pageSize)
            ->map(function ($asignacion) {
                $docente = $asignacion->docente;
                $user = $docente?->user;

                return [
                    'codigo_docente' => $docente->codigo_docente,
                    'user_id' => $user?->id,
                    'nombre_completo' => $user?->nombre_completo,
                    'email' => $user?->email,
                    'profesion' => $docente?->profesion,
                ];
            })
            ->values();


        return [
            'docentes' => $paginados,
            'paginacion' => [
                'total_registros' => $totalRegistros,
                'total_paginas' => $totalPaginas,
                'pagina_actual' => $page,
                'registros_por_pagina' => $pageSize,
                'tiene_siguiente' => $page < $totalPaginas,
                'tiene_anterior' => $page > 1,
            ],
            'filtros_aplicados' => [
                'nombre_docente' => $nombreDocente ?: null,
            ],
        ];
    }

    public function getAllDocentesActivos($id_gestion, $filtros = [])
    {
        $nombreDocente = strtolower(trim($filtros['nombre_docente'] ?? ''));

        $query = Asignacion::with(['docente.user'])
            ->where('id_gestion', $id_gestion)
            ->where('estado', 'Vigente')
            ->whereHas('docente.user');

        if (!empty($nombreDocente)) {
            $query->whereHas('docente.user', function ($q) use ($nombreDocente) {
                $q->whereRaw(
                    "LOWER(CONCAT(nombre, ' ', apellido_paterno, ' ', apellido_materno)) LIKE ?",
                    ["%{$nombreDocente}%"]
                );
            });
        }

        return $query->get()
            ->unique('codigo_docente')
            ->map(function ($asignacion) {
                $docente = $asignacion->docente;
                $user = $docente?->user;

                return [
                    'codigo_docente' => $docente->codigo_docente,
                    'user_id' => $user?->id,
                    'nombre_completo' => $user?->nombre_completo,
                    'email' => $user?->email,
                    'profesion' => $docente?->profesion,
                ];
            })
            ->values()
            ->toArray();
    }
}

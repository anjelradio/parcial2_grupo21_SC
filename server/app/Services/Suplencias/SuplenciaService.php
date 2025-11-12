<?php

namespace App\Services\Suplencias;

use App\Models\Suplencia;
use App\Models\GestionAcademica;
use App\Services\Bitacora\BitacoraService;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SuplenciaService
{
    protected $bitacoraService;

    public function __construct(BitacoraService $bitacoraService)
    {
        $this->bitacoraService = $bitacoraService;
    }

    /**
     * Obtener suplencias con paginación y filtros
     */
    public function getAllPaginated(array $filters = [])
    {
        $page = $filters['page'] ?? 1;
        $pageSize = $filters['page_size'] ?? 50;

        // Calcular gestión actual si no se envía
        $idGestion = $filters['id_gestion'] ?? $this->getCurrentGestionId();

        $query = Suplencia::with([
            'titular.user:id,nombre,apellido_paterno,apellido_materno',
            'suplente.user:id,nombre,apellido_paterno,apellido_materno',
            'asignacion.grupo.materia:id_materia,sigla,nombre',
            'asignacion.gestion:id_gestion,anio,semestre,fecha_inicio,fecha_fin'
        ])
            ->when($idGestion, function ($q) use ($idGestion) {
                // Filtrar por suplencias dentro del rango de la gestión actual
                $gestion = GestionAcademica::find($idGestion);
                if ($gestion) {
                    $q->whereBetween('fecha_inicio', [
                        $gestion->fecha_inicio,
                        $gestion->fecha_fin
                    ]);
                }
            })
            ->orderByDesc('fecha_registro');

        // Aplicar filtros dinámicos
        $this->applyFilters($query, $filters);

        // Paginación manual
        $total = $query->count();
        $totalPaginas = ceil($total / $pageSize);

        $suplencias = $query->skip(($page - 1) * $pageSize)
            ->take($pageSize)
            ->get()
            ->map(fn($s) => $this->formatSuplenciaData($s));

        return [
            'suplencias' => $suplencias,
            'paginacion' => [
                'total_registros' => $total,
                'total_paginas' => $totalPaginas,
                'pagina_actual' => (int) $page,
                'registros_por_pagina' => (int) $pageSize,
                'tiene_siguiente' => $page < $totalPaginas,
                'tiene_anterior' => $page > 1,
            ],
            'filtros_aplicados' => [
                'nombre_titular' => $filters['nombre_titular'] ?? null,
                'id_gestion' => $idGestion,
            ],
        ];
    }

    

    /**
     * Aplicar filtros a la consulta
     */
    private function applyFilters($query, array $filters)
    {
        // Filtro por nombre de docente titular
        if (!empty($filters['nombre_titular'])) {
            $nombre = $filters['nombre_titular'];
            $query->whereHas('titular.user', function ($q) use ($nombre) {
                $q->where(DB::raw("CONCAT(nombre, ' ', apellido_paterno, ' ', apellido_materno)"), 'LIKE', "%{$nombre}%");
            });
        }
    }

    /**
     * Obtener la gestión académica actual
     */
    private function getCurrentGestionId(): ?int
    {
        $hoy = Carbon::today();

        $gestion = GestionAcademica::where('fecha_inicio', '<=', $hoy)
            ->where('fecha_fin', '>=', $hoy)
            ->first();

        return $gestion?->id_gestion;
    }

    /**
     * Crear nueva suplencia
     */
    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            $suplencia = Suplencia::create([
                'cod_titular' => $data['cod_titular'],
                'cod_suplente' => $data['cod_suplente'],
                'id_asignacion' => $data['id_asignacion'],
                'motivo' => $data['motivo'],
                'fecha_inicio' => $data['fecha_inicio'],
                'fecha_fin' => $data['fecha_fin'],
                'estado' => 'Activa',
                'fecha_registro' => Carbon::now(),
            ]);

            $suplencia->load([
                'titular.user',
                'suplente.user',
                'asignacion.grupo.materia',
                'asignacion.gestion'
            ]);

            // Registrar en bitácora
            $descripcion = $this->generarDescripcionSuplencia($suplencia);
            $this->bitacoraService->registrar(
                "Creó suplencia: {$descripcion}"
            );

            return $this->formatSuplenciaData($suplencia);
        });
    }

    /**
     * Actualizar suplencia
     */
    public function update($id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $suplencia = Suplencia::with([
                'titular.user',
                'suplente.user',
                'asignacion.grupo.materia',
                'asignacion.gestion'
            ])->findOrFail($id);

            $descripcionAnterior = $this->generarDescripcionSuplencia($suplencia);

            $suplencia->update([
                'cod_titular' => $data['cod_titular'],
                'cod_suplente' => $data['cod_suplente'],
                'id_asignacion' => $data['id_asignacion'],
                'motivo' => $data['motivo'],
                'fecha_inicio' => $data['fecha_inicio'],
                'fecha_fin' => $data['fecha_fin'],
                'estado' => $data['estado'],
            ]);

            $suplencia->load([
                'titular.user',
                'suplente.user',
                'asignacion.grupo.materia',
                'asignacion.gestion'
            ]);

            // Registrar en bitácora
            $descripcionNueva = $this->generarDescripcionSuplencia($suplencia);
            $this->bitacoraService->registrar(
                "Modificó suplencia de '{$descripcionAnterior}' a '{$descripcionNueva}'"
            );

            return $this->formatSuplenciaData($suplencia);
        });
    }

    /**
     * Eliminar suplencia
     */
    public function delete($id)
    {
        return DB::transaction(function () use ($id) {
            $suplencia = Suplencia::with([
                'titular.user',
                'suplente.user',
                'asignacion.grupo.materia',
                'asignacion.gestion'
            ])->findOrFail($id);

            $descripcion = $this->generarDescripcionSuplencia($suplencia);
            $suplenciaData = $this->formatSuplenciaData($suplencia);

            $suplencia->delete();

            // Registrar en bitácora
            $this->bitacoraService->registrar(
                "Eliminó suplencia: {$descripcion}"
            );

            return $suplenciaData;
        });
    }

    /**
     * Formatear datos de la suplencia
     */
    private function formatSuplenciaData(Suplencia $suplencia)
    {
        $titular = $suplencia->titular;
        $suplente = $suplencia->suplente;
        $asignacion = $suplencia->asignacion;

        return [
            'id_suplencia' => $suplencia->id_suplencia,
            'id_asignacion' => $suplencia->id_asignacion,

            // Docente Titular
            'cod_titular' => $suplencia->cod_titular,
            'nombre_docente_titular' => $titular && $titular->user
                ? trim("{$titular->user->nombre} {$titular->user->apellido_paterno} {$titular->user->apellido_materno}")
                : 'Desconocido',

            // Docente Suplente
            'cod_suplente' => $suplencia->cod_suplente,
            'nombre_docente_suplente' => $suplente && $suplente->user
                ? trim("{$suplente->user->nombre} {$suplente->user->apellido_paterno} {$suplente->user->apellido_materno}")
                : 'Desconocido',

            // Materia y Grupo
            'materia' => $asignacion && $asignacion->grupo && $asignacion->grupo->materia ? [
                'id_materia' => $asignacion->grupo->materia->id_materia,
                'sigla' => $asignacion->grupo->materia->sigla,
                'nombre' => $asignacion->grupo->materia->nombre,
            ] : null,

            'grupo' => $asignacion && $asignacion->grupo ? [
                'id_grupo' => $asignacion->grupo->id_grupo,
                'nombre' => $asignacion->grupo->nombre,
            ] : null,

            'gestion' => $asignacion && $asignacion->gestion ? [
                'id_gestion' => $asignacion->gestion->id_gestion,
                'anio' => $asignacion->gestion->anio,
                'semestre' => $asignacion->gestion->semestre,
                'nombre_gestion' => "{$asignacion->gestion->anio}-{$asignacion->gestion->semestre}",
            ] : null,

            // Datos de la suplencia
            'motivo' => $suplencia->motivo,
            'fecha_inicio' => $suplencia->fecha_inicio?->format('Y-m-d'),
            'fecha_fin' => $suplencia->fecha_fin?->format('Y-m-d'),
            'estado' => $suplencia->estado,
            'fecha_registro' => $suplencia->fecha_registro?->format('Y-m-d H:i:s'),
        ];
    }

    /**
     * Generar descripción legible para la bitácora
     */
    private function generarDescripcionSuplencia(Suplencia $suplencia)
    {
        $titular = $suplencia->titular && $suplencia->titular->user
            ? trim("{$suplencia->titular->user->nombre} {$suplencia->titular->user->apellido_paterno}")
            : $suplencia->cod_titular;

        $suplente = $suplencia->suplente && $suplencia->suplente->user
            ? trim("{$suplencia->suplente->user->nombre} {$suplencia->suplente->user->apellido_paterno}")
            : $suplencia->cod_suplente;

        $materia = $suplencia->asignacion && $suplencia->asignacion->grupo && $suplencia->asignacion->grupo->materia
            ? $suplencia->asignacion->grupo->materia->sigla
            : 'N/A';

        $grupo = $suplencia->asignacion && $suplencia->asignacion->grupo
            ? $suplencia->asignacion->grupo->nombre
            : 'N/A';

        $fechas = "{$suplencia->fecha_inicio->format('d/m')} - {$suplencia->fecha_fin->format('d/m')}";

        return "{$materia} Grupo {$grupo} - {$titular} → {$suplente} ({$fechas}) [{$suplencia->estado}]";
    }
}

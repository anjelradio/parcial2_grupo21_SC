<?php

namespace App\Services\Asignaciones;

use App\Models\Asignacion;
use App\Models\DetalleHorario;
use App\Services\Bitacora\BitacoraService;
use Illuminate\Support\Facades\DB;

class AsignacionService
{
    protected $bitacoraService;

    public function __construct(BitacoraService $bitacoraService)
    {
        $this->bitacoraService = $bitacoraService;
    }

    /**
     * Obtener todas las asignaciones con sus relaciones
     */
    public function getAll()
    {
        return Asignacion::with([
            'docente.user:id,nombre,apellido_paterno,apellido_materno',
            'grupo.materia:id_materia,sigla,nombre',
            'gestion:id_gestion,anio,semestre',
            'detallesHorario.dia:id_dia,nombre',
            'detallesHorario.bloque:id_bloque,hora_inicio,hora_fin',
            'detallesHorario.aula:nro_aula,tipo,capacidad'
        ])
        ->orderBy('id_asignacion', 'desc')
        ->get()
        ->map(function ($asignacion) {
            return $this->formatAsignacionData($asignacion);
        });
    }

    /**
     * Crear nueva asignación con detalles horarios
     */
    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            // 1. Crear la asignación principal
            $asignacion = Asignacion::create([
                'codigo_docente' => $data['codigo_docente'],
                'id_grupo' => $data['id_grupo'],
                'id_gestion' => $data['id_gestion'],
                'estado' => $data['estado'],
                'observaciones' => $data['observaciones'] ?? null,
            ]);

            // 2. Crear los detalles horarios
            foreach ($data['detalles_horario'] as $detalle) {
                DetalleHorario::create([
                    'id_asignacion' => $asignacion->id_asignacion,
                    'id_dia' => $detalle['id_dia'],
                    'id_bloque' => $detalle['id_bloque'],
                    'nro_aula' => $detalle['nro_aula'],
                ]);
            }

            // 3. Recargar la asignación con todas las relaciones
            $asignacion->load([
                'docente.user',
                'grupo.materia',
                'gestion',
                'detallesHorario.dia',
                'detallesHorario.bloque',
                'detallesHorario.aula'
            ]);

            // 4. Registrar en bitácora
            $descripcion = $this->generarDescripcionAsignacion($asignacion);
            $this->bitacoraService->registrar(
                "Creó asignación: {$descripcion}"
            );

            return $this->formatAsignacionData($asignacion);
        });
    }

    /**
     * Actualizar asignación existente
     */
    public function update($id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $asignacion = Asignacion::findOrFail($id);
            $descripcionAnterior = $this->generarDescripcionAsignacion($asignacion);

            // 1. Actualizar datos principales
            $asignacion->update([
                'codigo_docente' => $data['codigo_docente'],
                'id_grupo' => $data['id_grupo'],
                'id_gestion' => $data['id_gestion'],
                'estado' => $data['estado'],
                'observaciones' => $data['observaciones'] ?? null,
            ]);

            // 2. Eliminar detalles horarios antiguos
            DetalleHorario::where('id_asignacion', $asignacion->id_asignacion)->delete();

            // 3. Crear nuevos detalles horarios
            foreach ($data['detalles_horario'] as $detalle) {
                DetalleHorario::create([
                    'id_asignacion' => $asignacion->id_asignacion,
                    'id_dia' => $detalle['id_dia'],
                    'id_bloque' => $detalle['id_bloque'],
                    'nro_aula' => $detalle['nro_aula'],
                ]);
            }

            // 4. Recargar con relaciones
            $asignacion->load([
                'docente.user',
                'grupo.materia',
                'gestion',
                'detallesHorario.dia',
                'detallesHorario.bloque',
                'detallesHorario.aula'
            ]);

            // 5. Registrar en bitácora
            $descripcionNueva = $this->generarDescripcionAsignacion($asignacion);
            $this->bitacoraService->registrar(
                "Modificó asignación de '{$descripcionAnterior}' a '{$descripcionNueva}'"
            );

            return $this->formatAsignacionData($asignacion);
        });
    }

    /**
     * Eliminar asignación
     */
    public function delete($id)
    {
        return DB::transaction(function () use ($id) {
            $asignacion = Asignacion::with([
                'docente.user',
                'grupo.materia',
                'gestion',
                'detallesHorario'
            ])->findOrFail($id);

            $descripcion = $this->generarDescripcionAsignacion($asignacion);
            $asignacionData = $this->formatAsignacionData($asignacion);

            // Eliminar (los detalles horarios se eliminan en cascada por la BD)
            $asignacion->delete();

            // Registrar en bitácora
            $this->bitacoraService->registrar(
                "Eliminó asignación: {$descripcion}"
            );

            return $asignacionData;
        });
    }

    /**
     * Formatear datos de la asignación
     */
    private function formatAsignacionData(Asignacion $asignacion)
    {
        return [
            'id_asignacion' => $asignacion->id_asignacion,
            'codigo_docente' => $asignacion->codigo_docente,
            'docente' => $asignacion->docente ? [
                'codigo_docente' => $asignacion->docente->codigo_docente,
                'nombre_completo' => $asignacion->docente->user ? 
                    trim("{$asignacion->docente->user->nombre} {$asignacion->docente->user->apellido_paterno} {$asignacion->docente->user->apellido_materno}") : 
                    'Desconocido',
                'profesion' => $asignacion->docente->profesion,
            ] : null,
            'id_grupo' => $asignacion->id_grupo,
            'grupo' => $asignacion->grupo ? [
                'id_grupo' => $asignacion->grupo->id_grupo,
                'nombre' => $asignacion->grupo->nombre,
                'materia' => $asignacion->grupo->materia ? [
                    'id_materia' => $asignacion->grupo->materia->id_materia,
                    'sigla' => $asignacion->grupo->materia->sigla,
                    'nombre' => $asignacion->grupo->materia->nombre,
                ] : null,
            ] : null,
            'id_gestion' => $asignacion->id_gestion,
            'gestion' => $asignacion->gestion ? [
                'id_gestion' => $asignacion->gestion->id_gestion,
                'anio' => $asignacion->gestion->anio,
                'semestre' => $asignacion->gestion->semestre,
                'nombre_gestion' => "{$asignacion->gestion->anio}-{$asignacion->gestion->semestre}",
            ] : null,
            'estado' => $asignacion->estado,
            'observaciones' => $asignacion->observaciones,
            'detalles_horario' => $asignacion->detallesHorario->map(function ($detalle) {
                return [
                    'id_detallehorario' => $detalle->id_detallehorario,
                    'dia' => $detalle->dia ? [
                        'id_dia' => $detalle->dia->id_dia,
                        'nombre' => $detalle->dia->nombre,
                    ] : null,
                    'bloque' => $detalle->bloque ? [
                        'id_bloque' => $detalle->bloque->id_bloque,
                        'hora_inicio' => $detalle->bloque->hora_inicio->format('H:i'),
                        'hora_fin' => $detalle->bloque->hora_fin->format('H:i'),
                        'rango' => $detalle->bloque->rango(),
                    ] : null,
                    'aula' => $detalle->aula ? [
                        'nro_aula' => $detalle->aula->nro_aula,
                        'tipo' => $detalle->aula->tipo,
                        'capacidad' => $detalle->aula->capacidad,
                    ] : null,
                    'descripcion' => $detalle->descripcion,
                ];
            }),
        ];
    }

    /**
     * Generar descripción legible de la asignación para la bitácora
     */
    private function generarDescripcionAsignacion(Asignacion $asignacion)
    {
        $docente = $asignacion->docente && $asignacion->docente->user
            ? trim("{$asignacion->docente->user->nombre} {$asignacion->docente->user->apellido_paterno}")
            : $asignacion->codigo_docente;

        $materia = $asignacion->grupo && $asignacion->grupo->materia
            ? $asignacion->grupo->materia->sigla
            : 'N/A';

        $grupo = $asignacion->grupo ? $asignacion->grupo->nombre : 'N/A';

        $gestion = $asignacion->gestion
            ? "{$asignacion->gestion->anio}-{$asignacion->gestion->semestre}"
            : 'N/A';

        return "{$materia} Grupo {$grupo} - {$docente} (Gestión {$gestion})";
    }
}
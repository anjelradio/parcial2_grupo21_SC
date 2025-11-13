<?php

namespace App\Services\ConsultaGestion;

use App\Models\Asignacion;

class AsignacionService
{
    public function getAsignacionesConHorarios($id_gestion, array $filtros = [])
    {
        $nombreDocente = strtolower(trim($filtros['nombre_docente'] ?? ''));
        $nombreMateria = strtolower(trim($filtros['nombre_materia'] ?? ''));

        $query = Asignacion::with([
            'docente.user',
            'grupo.materia',
            'detallesHorario.dia',
            'detallesHorario.bloque',
            'detallesHorario.aula',
        ])
            ->where('id_gestion', $id_gestion)
            ->where('estado', 'Vigente');

        if (!empty($nombreDocente)) {
            $query->whereHas('docente.user', function ($q) use ($nombreDocente) {
                $q->whereRaw("LOWER(CONCAT(nombre, ' ', apellido_paterno, ' ', apellido_materno)) LIKE ?", ["%{$nombreDocente}%"]);
            });
        }

        if (!empty($nombreMateria)) {
            $query->whereHas('grupo.materia', function ($q) use ($nombreMateria) {
                $q->whereRaw("LOWER(nombre) LIKE ?", ["%{$nombreMateria}%"]);
            });
        }

        return $query->get()->map(function ($asignacion) {
            $docente = $asignacion->docente?->user?->nombre_completo ?? 'Sin docente';
            $materia = $asignacion->grupo?->materia?->nombre ?? 'Sin materia';
            $sigla = $asignacion->grupo?->materia?->sigla ?? '-';
            $grupo = $asignacion->grupo?->nombre ?? '-';

            // Armar lista de horarios
            $horarios = $asignacion->detallesHorario->map(function ($detalle) {
                $dia = $detalle->dia?->nombre ?? 'N/A';
                $bloque = $detalle->bloque
                    ? "{$detalle->bloque->hora_inicio->format('H:i')} - {$detalle->bloque->hora_fin->format('H:i')}"
                    : '—';
                $aula = $detalle->aula?->nro_aula ?? '—';
                return [
                    'horario' => "{$dia} ({$bloque})",
                    'aula' => $aula
                ];
            })->values();

            return [
                'grupo' => $grupo,
                'materia' => $materia,
                'sigla' => $sigla,
                'docente' => $docente,
                'horarios' => $horarios
            ];
        })->toArray();
    }
}

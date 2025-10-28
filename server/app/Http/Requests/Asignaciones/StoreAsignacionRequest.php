<?php

namespace App\Http\Requests\Asignaciones;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use App\Models\DetalleHorario;
use App\Models\BloqueHorario;
use App\Models\Asignacion;

class StoreAsignacionRequest extends FormRequest
{
    private $conflictos = [];

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'codigo_docente' => 'required|string|exists:docente,codigo_docente',
            'id_grupo' => 'required|integer|exists:grupo,id_grupo',
            'id_gestion' => 'required|integer|exists:gestion_academica,id_gestion',
            'estado' => 'required|in:Vigente,Finalizada,Cancelada',
            'observaciones' => 'nullable|string|max:500',
            
            'detalles_horario' => 'required|array|min:1',
            'detalles_horario.*.id_dia' => 'required|integer|exists:dia,id_dia',
            'detalles_horario.*.id_bloque' => 'required|integer|exists:bloque_horario,id_bloque',
            'detalles_horario.*.nro_aula' => 'required|string|exists:aula,nro_aula',
        ];
    }

    public function messages(): array
    {
        return [
            'codigo_docente.required' => 'El código del docente es obligatorio',
            'codigo_docente.exists' => 'El docente seleccionado no existe',
            
            'id_grupo.required' => 'El grupo es obligatorio',
            'id_grupo.exists' => 'El grupo seleccionado no existe',
            
            'id_gestion.required' => 'La gestión académica es obligatoria',
            'id_gestion.exists' => 'La gestión académica seleccionada no existe',
            
            'estado.required' => 'El estado es obligatorio',
            'estado.in' => 'El estado debe ser: Vigente, Finalizada o Cancelada',
            
            'observaciones.max' => 'Las observaciones no pueden exceder 500 caracteres',
            
            'detalles_horario.required' => 'Debe incluir al menos un detalle de horario',
            'detalles_horario.array' => 'Los detalles de horario deben ser un arreglo',
            'detalles_horario.min' => 'Debe incluir al menos un detalle de horario',
            
            'detalles_horario.*.id_dia.required' => 'El día es obligatorio en cada detalle',
            'detalles_horario.*.id_dia.exists' => 'El día seleccionado no existe',
            
            'detalles_horario.*.id_bloque.required' => 'El bloque horario es obligatorio en cada detalle',
            'detalles_horario.*.id_bloque.exists' => 'El bloque horario seleccionado no existe',
            
            'detalles_horario.*.nro_aula.required' => 'El aula es obligatoria en cada detalle',
            'detalles_horario.*.nro_aula.exists' => 'El aula seleccionada no existe',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if (!$validator->errors()->any()) {
                $this->validarConflictos($validator);
            }
        });
    }

    private function validarConflictos($validator)
    {
        $codigoDocente = $this->input('codigo_docente');
        $idGrupo = $this->input('id_grupo');
        $idGestion = $this->input('id_gestion');
        $detallesHorario = $this->input('detalles_horario');

        foreach ($detallesHorario as $index => $detalle) {
            $idDia = $detalle['id_dia'];
            $idBloque = $detalle['id_bloque'];
            $nroAula = $detalle['nro_aula'];

            $bloque = BloqueHorario::find($idBloque);
            if (!$bloque) continue;

            // 1. CONFLICTO DE AULA
            $this->verificarConflicto('aula', $nroAula, $idDia, $bloque, $idGestion, null, null);

            // 2. CONFLICTO DE DOCENTE
            $this->verificarConflicto('docente', null, $idDia, $bloque, $idGestion, $codigoDocente, null);

            // 3. CONFLICTO DE GRUPO
            $this->verificarConflicto('grupo', null, $idDia, $bloque, $idGestion, null, $idGrupo);
        }

        if (!empty($this->conflictos)) {
            $validator->errors()->add('conflictos', 'Se detectaron conflictos de horarios');
        }
    }

    private function verificarConflicto($tipo, $nroAula, $idDia, $bloque, $idGestion, $codigoDocente = null, $idGrupo = null)
    {
        $query = DetalleHorario::with([
            'asignacion.docente.user:id,nombre,apellido_paterno,apellido_materno',
            'asignacion.grupo.materia:id_materia,sigla,nombre',
            'asignacion.gestion:id_gestion,anio,semestre',
            'dia:id_dia,nombre',
            'bloque:id_bloque,hora_inicio,hora_fin',
            'aula:nro_aula,tipo'
        ])->where('id_dia', $idDia);

        if ($tipo === 'aula') {
            $query->where('nro_aula', $nroAula);
        }

        $query->whereHas('asignacion', function ($q) use ($idGestion, $codigoDocente, $idGrupo) {
            $q->where('id_gestion', $idGestion)->where('estado', 'Vigente');
            if ($codigoDocente) $q->where('codigo_docente', $codigoDocente);
            if ($idGrupo) $q->where('id_grupo', $idGrupo);
        });

        $query->whereHas('bloque', function ($q) use ($bloque) {
            $q->where(function ($query) use ($bloque) {
                $query->where(function ($q) use ($bloque) {
                    $q->where('hora_inicio', '>=', $bloque->hora_inicio)
                      ->where('hora_inicio', '<', $bloque->hora_fin);
                })->orWhere(function ($q) use ($bloque) {
                    $q->where('hora_fin', '>', $bloque->hora_inicio)
                      ->where('hora_fin', '<=', $bloque->hora_fin);
                })->orWhere(function ($q) use ($bloque) {
                    $q->where('hora_inicio', '<=', $bloque->hora_inicio)
                      ->where('hora_fin', '>=', $bloque->hora_fin);
                });
            });
        });

        $detallesConflictivos = $query->get();

        if ($detallesConflictivos->isNotEmpty()) {
            foreach ($detallesConflictivos as $detalleConflicto) {
                $this->conflictos[] = [
                    'tipo_conflicto' => $tipo,
                    'mensaje' => "Conflicto de {$tipo} en {$detalleConflicto->dia->nombre} de {$detalleConflicto->bloque->rango()}",
                    'asignacion_conflictiva' => $this->formatearAsignacionConflicto($detalleConflicto),
                ];
            }
        }
    }

    private function formatearAsignacionConflicto($detalleHorario)
    {
        $asignacion = $detalleHorario->asignacion;
        
        return [
            'id_asignacion' => $asignacion->id_asignacion,
            'docente' => [
                'codigo_docente' => $asignacion->docente->codigo_docente,
                'nombre_completo' => $asignacion->docente->user ? 
                    trim("{$asignacion->docente->user->nombre} {$asignacion->docente->user->apellido_paterno} {$asignacion->docente->user->apellido_materno}") : 
                    'Desconocido',
            ],
            'grupo' => [
                'id_grupo' => $asignacion->grupo->id_grupo,
                'nombre' => $asignacion->grupo->nombre,
                'materia' => [
                    'sigla' => $asignacion->grupo->materia->sigla,
                    'nombre' => $asignacion->grupo->materia->nombre,
                ],
            ],
            'gestion' => [
                'anio' => $asignacion->gestion->anio,
                'semestre' => $asignacion->gestion->semestre,
            ],
            'detalle_horario' => [
                'dia' => $detalleHorario->dia->nombre,
                'bloque' => $detalleHorario->bloque->rango(),
                'aula' => $detalleHorario->aula->nro_aula,
            ],
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        $errors = $validator->errors()->all();
        
        $response = [
            'ok' => false,
            'message' => !empty($this->conflictos) 
                ? 'Se detectaron conflictos de horarios' 
                : implode('. ', $errors),
        ];

        // Si hay conflictos, agruparlos por asignación
        if (!empty($this->conflictos)) {
            $response['data'] = [
                'conflictos' => $this->agruparConflictosPorAsignacion()
            ];
        }
        
        throw new HttpResponseException(
            response()->json($response, 422)
        );
    }

    /**
     * Agrupar conflictos por asignación para evitar duplicados
     */
    private function agruparConflictosPorAsignacion()
    {
        $agrupados = [];

        foreach ($this->conflictos as $conflicto) {
            $idAsignacion = $conflicto['asignacion_conflictiva']['id_asignacion'];

            // Si la asignación no existe en el array, agregarla
            if (!isset($agrupados[$idAsignacion])) {
                $agrupados[$idAsignacion] = [
                    'asignacion' => $conflicto['asignacion_conflictiva'],
                    'conflictos' => []
                ];
            }

            // Agregar el tipo de conflicto
            $agrupados[$idAsignacion]['conflictos'][] = [
                'tipo' => $conflicto['tipo_conflicto'],
                'mensaje' => $conflicto['mensaje']
            ];
        }

        // Convertir el array asociativo a array indexado
        return array_values($agrupados);
    }
}
<?php

namespace App\Http\Requests\Suplencias;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;
use App\Models\Asignacion;
use App\Models\DetalleHorario;

class StoreSuplenciaRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Solo ADMIN o AUTORIDAD pueden crear suplencias
        $user = $this->user();
        return $user && ($user->isAdmin() || $user->isAutoridad());
    }

    public function rules(): array
    {
        return [
            'cod_titular' => 'required|exists:docente,codigo_docente',
            'cod_suplente' => [
                'required',
                'exists:docente,codigo_docente',
                'different:cod_titular'
            ],
            'id_asignacion' => [
                'required',
                'exists:asignacion,id_asignacion',
                // Validar que no exista ya una suplencia para esta asignación
                Rule::unique('suplencia', 'id_asignacion')
            ],
            'motivo' => 'required|string|max:500',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Validar que el titular de la asignación coincida con cod_titular
            $this->validarTitularAsignacion($validator);
            
            // Validar que el suplente no tenga conflictos de horario
            $this->validarConflictosHorario($validator);
        });
    }

    /**
     * Validar que el cod_titular coincida con el docente de la asignación
     */
    protected function validarTitularAsignacion($validator)
    {
        if ($this->id_asignacion && $this->cod_titular) {
            $asignacion = Asignacion::find($this->id_asignacion);
            
            if ($asignacion && $asignacion->codigo_docente !== $this->cod_titular) {
                $validator->errors()->add(
                    'cod_titular',
                    'El código del titular no coincide con el docente de la asignación seleccionada'
                );
            }
        }
    }

    /**
     * Validar que el suplente no tenga conflictos de horario
     */
    protected function validarConflictosHorario($validator)
    {
        if (!$this->id_asignacion || !$this->cod_suplente) {
            return;
        }

        // Obtener los horarios de la asignación a suplir
        $horariosAsignacionSuplir = DetalleHorario::where('id_asignacion', $this->id_asignacion)
            ->with(['dia', 'bloque'])
            ->get();

        if ($horariosAsignacionSuplir->isEmpty()) {
            return; // No hay horarios definidos, no hay conflicto
        }

        // Obtener todas las asignaciones del suplente como titular
        $asignacionesSuplente = Asignacion::where('codigo_docente', $this->cod_suplente)
            ->where('estado', 'Vigente')
            ->pluck('id_asignacion');

        if ($asignacionesSuplente->isEmpty()) {
            return; // El suplente no tiene asignaciones como titular
        }

        // Obtener los horarios del suplente en sus asignaciones como titular
        $horariosSuplente = DetalleHorario::whereIn('id_asignacion', $asignacionesSuplente)
            ->with(['dia', 'bloque', 'asignacion.grupo.materia'])
            ->get();

        // Verificar conflictos
        foreach ($horariosAsignacionSuplir as $horarioSuplir) {
            foreach ($horariosSuplente as $horarioSuplente) {
                // Mismo día
                if ($horarioSuplir->id_dia === $horarioSuplente->id_dia) {
                    // Mismo bloque horario
                    if ($horarioSuplir->id_bloque === $horarioSuplente->id_bloque) {
                        $dia = $horarioSuplente->dia->nombre ?? 'Desconocido';
                        $horario = $horarioSuplente->bloque 
                            ? "{$horarioSuplente->bloque->hora_inicio->format('H:i')} - {$horarioSuplente->bloque->hora_fin->format('H:i')}"
                            : 'Desconocido';
                        
                        $materiaConflicto = $horarioSuplente->asignacion 
                            && $horarioSuplente->asignacion->grupo 
                            && $horarioSuplente->asignacion->grupo->materia
                            ? $horarioSuplente->asignacion->grupo->materia->sigla
                            : 'Materia desconocida';

                        $validator->errors()->add(
                            'cod_suplente',
                            "El docente suplente tiene un conflicto de horario: {$dia} de {$horario} (ya dicta {$materiaConflicto})"
                        );
                        return; // Detener al primer conflicto encontrado
                    }
                }
            }
        }
    }

    public function messages(): array
    {
        return [
            'cod_titular.required' => 'El código del docente titular es obligatorio',
            'cod_titular.exists' => 'El docente titular no existe',
            
            'cod_suplente.required' => 'El código del docente suplente es obligatorio',
            'cod_suplente.exists' => 'El docente suplente no existe',
            'cod_suplente.different' => 'El docente suplente debe ser diferente al titular',
            
            'id_asignacion.required' => 'La asignación es obligatoria',
            'id_asignacion.exists' => 'La asignación seleccionada no existe',
            'id_asignacion.unique' => 'Ya existe una suplencia para esta asignación',
            
            'motivo.required' => 'El motivo es obligatorio',
            'motivo.max' => 'El motivo no puede exceder 500 caracteres',
            
            'fecha_inicio.required' => 'La fecha de inicio es obligatoria',
            'fecha_inicio.date' => 'La fecha de inicio debe ser una fecha válida',
            
            'fecha_fin.required' => 'La fecha de fin es obligatoria',
            'fecha_fin.date' => 'La fecha de fin debe ser una fecha válida',
            'fecha_fin.after_or_equal' => 'La fecha de fin debe ser igual o posterior a la fecha de inicio',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'ok' => false,
                'message' => 'Errores de validación',
                'errors' => $validator->errors()
            ], 422)
        );
    }

    protected function failedAuthorization()
    {
        throw new HttpResponseException(
            response()->json([
                'ok' => false,
                'message' => 'No tienes permisos para realizar esta acción. Solo ADMIN y AUTORIDAD pueden gestionar suplencias.'
            ], 403)
        );
    }
}
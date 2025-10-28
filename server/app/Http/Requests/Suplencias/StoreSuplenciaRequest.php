<?php

namespace App\Http\Requests\Suplencias;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

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
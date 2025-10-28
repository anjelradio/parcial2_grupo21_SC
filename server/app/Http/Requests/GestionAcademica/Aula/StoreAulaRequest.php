<?php

namespace App\Http\Requests\GestionAcademica\Aula;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreAulaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nro_aula' => 'required|string|max:10|unique:aula,nro_aula',
            'tipo' => 'required|in:Aula,Laboratorio,Auditorio',
            'capacidad' => 'required|integer|min:1|max:500',
            'estado' => 'required|in:Disponible,En uso,Mantenimiento,Inactiva',
        ];
    }

    public function messages(): array
    {
        return [
            'nro_aula.required' => 'El número de aula es obligatorio',
            'nro_aula.max' => 'El número de aula no puede exceder 10 caracteres',
            'nro_aula.unique' => 'Este número de aula ya está registrado',
            
            'tipo.required' => 'El tipo de aula es obligatorio',
            'tipo.in' => 'El tipo debe ser: Aula, Laboratorio o Auditorio',
            
            'capacidad.required' => 'La capacidad es obligatoria',
            'capacidad.integer' => 'La capacidad debe ser un número entero',
            'capacidad.min' => 'La capacidad debe ser al menos 1',
            'capacidad.max' => 'La capacidad no puede exceder 500',
            
            'estado.required' => 'El estado es obligatorio',
            'estado.in' => 'El estado debe ser: Disponible, En uso, Mantenimiento o Inactiva',
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
}
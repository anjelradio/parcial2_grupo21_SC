<?php

namespace App\Http\Requests\GestionAcademica\Materia;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreMateriaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'sigla' => 'required|string|max:20|unique:materia,sigla',
            'nombre' => 'required|string|max:150|unique:materia,nombre',
        ];
    }

    public function messages(): array
    {
        return [
            'sigla.required' => 'La sigla es obligatoria',
            'sigla.max' => 'La sigla no puede exceder 20 caracteres',
            'sigla.unique' => 'Esta sigla ya está registrada',
            
            'nombre.required' => 'El nombre es obligatorio',
            'nombre.max' => 'El nombre no puede exceder 150 caracteres',
            'nombre.unique' => 'Este nombre ya está registrado',
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
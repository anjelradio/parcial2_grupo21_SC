<?php

namespace App\Http\Requests\GestionAcademica\Dia;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreDiaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => 'required|string|max:10|unique:dia,nombre',
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre del día es obligatorio',
            'nombre.max' => 'El nombre del día no puede exceder 10 caracteres',
            'nombre.unique' => 'Este día ya está registrado',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        $errors = $validator->errors()->all();
        
        throw new HttpResponseException(
            response()->json([
                'ok' => false,
                'message' => implode('. ', $errors)
            ], 422)
        );
    }
}
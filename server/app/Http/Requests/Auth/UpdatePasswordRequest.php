<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdatePasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Requiere autenticación
    }

    public function rules(): array
    {
        return [
            'password_actual' => 'required|string|min:4',
            'password_nueva' => 'required|string|min:4',
            'password_confirmacion' => 'required|string|min:4',
        ];
    }

    public function messages(): array
    {
        return [
            'password_actual.required' => 'La contraseña actual es obligatoria.',
            'password_nueva.required' => 'Debes ingresar una nueva contraseña.',
            'password_confirmacion.required' => 'Debes confirmar la nueva contraseña.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'ok' => false,
                'message' => 'Errores de validación',
                'errors' => $validator->errors(),
            ], 422)
        );
    }
}

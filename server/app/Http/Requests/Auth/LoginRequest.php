<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Si viene email, valida email. Si viene codigo_docente, valida codigo
        return [
            'email' => 'required_without:codigo_docente|email|max:100',
            'codigo_docente' => 'required_without:email|string|max:10',
            'password' => 'required|string|min:4',
        ];
    }

    public function messages(): array
    {
        return [
            'email.required_without' => 'El email o código de docente es obligatorio',
            'email.email' => 'Debe ser un email válido',
            'codigo_docente.required_without' => 'El código de docente o email es obligatorio',
            'codigo_docente.max' => 'El código no puede tener más de 10 caracteres',
            'password.required' => 'La contraseña es obligatoria',
            'password.min' => 'La contraseña debe tener al menos 4 caracteres',
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
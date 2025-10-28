<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class PasswordResetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => 'nullable|email|max:100|required_without:codigo_docente',
            'codigo_docente' => 'nullable|string|max:10|required_without:email',
        ];
    }

    public function messages(): array
    {
        return [
            'email.required_without' => 'Debes ingresar tu email o código de docente.',
            'codigo_docente.required_without' => 'Debes ingresar tu código de docente o email.',
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

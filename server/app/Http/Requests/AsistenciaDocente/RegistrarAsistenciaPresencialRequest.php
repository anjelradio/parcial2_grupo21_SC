<?php

namespace App\Http\Requests\AsistenciaDocente;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class RegistrarAsistenciaPresencialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'token_qr' => 'required|string',
            'lat' => 'required|numeric|between:-90,90',
            'lng' => 'required|numeric|between:-180,180',
        ];
    }

    public function messages(): array
    {
        return [
            'token_qr.required' => 'El token del QR es obligatorio',
            'token_qr.string' => 'El token del QR debe ser una cadena de texto',
            'lat.required' => 'La latitud es obligatoria',
            'lat.numeric' => 'La latitud debe ser un número',
            'lat.between' => 'La latitud debe estar entre -90 y 90',
            'lng.required' => 'La longitud es obligatoria',
            'lng.numeric' => 'La longitud debe ser un número',
            'lng.between' => 'La longitud debe estar entre -180 y 180',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'ok' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422)
        );
    }
}
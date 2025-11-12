<?php

namespace App\Http\Requests\AsistenciaDocente;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class RegistrarAsistenciaVirtualRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file' => 'required|image|mimes:jpeg,jpg,png|max:10240', // Max 10MB
            'confianza' => 'required|numeric|min:0|max:100',
            'motivo' => 'required|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'file.required' => 'La imagen de evidencia es obligatoria',
            'file.image' => 'El archivo debe ser una imagen',
            'file.mimes' => 'La imagen debe ser formato JPEG, JPG o PNG',
            'file.max' => 'La imagen no debe superar los 10MB',
            'confianza.required' => 'El nivel de confianza es obligatorio',
            'confianza.numeric' => 'La confianza debe ser un número',
            'confianza.min' => 'La confianza debe ser al menos 0',
            'confianza.max' => 'La confianza no puede superar 100',
            'motivo.required' => 'El motivo de la asistencia virtual es obligatorio',
            'motivo.string' => 'El motivo debe ser texto',
            'motivo.max' => 'El motivo no debe superar los 500 caracteres',
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
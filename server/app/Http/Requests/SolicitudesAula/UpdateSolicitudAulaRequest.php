<?php

namespace App\Http\Requests\SolicitudesAula;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateSolicitudAulaRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        // Solo ADMIN o AUTORIDAD pueden aprobar/rechazar solicitudes
        return $user && ($user->isAdmin() || $user->isAutoridad());
    }

    public function rules(): array
    {
        return [
            'estado' => 'required|in:Pendiente,Aprobada,Rechazada',
            'observaciones' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'estado.required' => 'El estado es obligatorio.',
            'estado.in' => 'El estado debe ser Pendiente, Aprobada o Rechazada.',
            'observaciones.max' => 'Las observaciones no pueden exceder los 500 caracteres.',
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

    protected function failedAuthorization()
    {
        throw new HttpResponseException(
            response()->json([
                'ok' => false,
                'message' => 'No tienes permisos para realizar esta acción. Solo ADMIN y AUTORIDAD pueden actualizar solicitudes de aula.',
            ], 403)
        );
    }
}

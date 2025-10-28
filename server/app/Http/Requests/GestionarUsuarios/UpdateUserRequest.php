<?php

namespace App\Http\Requests\GestionarUsuarios;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('id'); // Obtener el ID de la ruta
        
        return [
            'nombre' => 'required|string|max:100',
            'apellido_paterno' => 'required|string|max:100',
            'apellido_materno' => 'required|string|max:100',
            'email' => [
                'required',
                'email',
                'max:100',
                Rule::unique('users', 'email')->ignore($userId)
            ],
            'rol' => 'required|in:ADMIN,DOCENTE,AUTORIDAD',
            
            // Campo específico para docentes
            'profesion' => 'required_if:rol,DOCENTE|nullable|string|max:150',
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre es obligatorio',
            'nombre.max' => 'El nombre no puede exceder 100 caracteres',
            
            'apellido_paterno.required' => 'El apellido paterno es obligatorio',
            'apellido_paterno.max' => 'El apellido paterno no puede exceder 100 caracteres',
            
            'apellido_materno.required' => 'El apellido materno es obligatorio',
            'apellido_materno.max' => 'El apellido materno no puede exceder 100 caracteres',
            
            'email.required' => 'El email es obligatorio',
            'email.email' => 'Debe ser un email válido',
            'email.unique' => 'Este email ya está registrado',
            
            'rol.required' => 'El rol es obligatorio',
            'rol.in' => 'El rol debe ser ADMIN, DOCENTE o AUTORIDAD',
            
            'profesion.required_if' => 'La profesión es obligatoria para docentes',
            'profesion.max' => 'La profesión no puede exceder 150 caracteres',
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
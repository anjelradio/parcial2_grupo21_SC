<?php

namespace App\Http\Requests\GestionarUsuarios;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => 'required|string|max:100',
            'apellido_paterno' => 'required|string|max:100',
            'apellido_materno' => 'required|string|max:100',
            'email' => 'required|email|max:100|unique:users,email',
            'password' => 'required|string|min:4',
            'rol' => 'required|in:ADMIN,DOCENTE,AUTORIDAD',
            
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
            
            'password.required' => 'La contraseña es obligatoria',
            'password.min' => 'La contraseña debe tener al menos 4 caracteres',
            
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
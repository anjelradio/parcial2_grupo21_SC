<?php

namespace App\Http\Requests\GestionAcademica\Grupos;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class UpdateGrupoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $grupoId = $this->route('id');
        
        return [
            'nombre' => [
                'required',
                'string',
                'max:10',
                // No repetir nombre en la misma materia, excepto el grupo actual
                Rule::unique('grupo')->where(function ($query) {
                    return $query->where('id_materia', $this->id_materia);
                })->ignore($grupoId, 'id_grupo'),
            ],
            'id_materia' => 'required|exists:materia,id_materia',
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre del grupo es obligatorio',
            'nombre.max' => 'El nombre no puede exceder 10 caracteres',
            'nombre.unique' => 'Ya existe un grupo con este nombre para esta materia',
            
            'id_materia.required' => 'La materia es obligatoria',
            'id_materia.exists' => 'La materia seleccionada no existe',
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
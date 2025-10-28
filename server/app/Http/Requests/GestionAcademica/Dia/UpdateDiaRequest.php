<?php

namespace App\Http\Requests\GestionAcademica\Dia;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class UpdateDiaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $idDia = $this->route('id');
        
        return [
            'nombre' => [
                'required',
                'string',
                'max:10',
                Rule::unique('dia', 'nombre')->ignore($idDia, 'id_dia')
            ],
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
<?php

namespace App\Http\Requests\GestionAcademica\BloqueHorario;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateBloqueHorarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'hora_inicio' => 'required|date_format:H:i',
            'hora_fin' => 'required|date_format:H:i|after:hora_inicio',
        ];
    }

    public function messages(): array
    {
        return [
            'hora_inicio.required' => 'La hora de inicio es obligatoria',
            'hora_inicio.date_format' => 'La hora de inicio debe tener el formato HH:MM (ej: 08:00)',
            
            'hora_fin.required' => 'La hora de fin es obligatoria',
            'hora_fin.date_format' => 'La hora de fin debe tener el formato HH:MM (ej: 09:40)',
            'hora_fin.after' => 'La hora de fin debe ser posterior a la hora de inicio',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if (!$validator->errors()->any()) {
                $idBloque = $this->route('id');
                $horaInicio = $this->input('hora_inicio');
                $horaFin = $this->input('hora_fin');

                // Verificar solapamiento con otros bloques (excluyendo el actual)
                $solapamiento = \App\Models\BloqueHorario::where('id_bloque', '!=', $idBloque)
                    ->where(function ($query) use ($horaInicio, $horaFin) {
                        $query->where(function ($q) use ($horaInicio, $horaFin) {
                            $q->where('hora_inicio', '<=', $horaInicio)
                              ->where('hora_fin', '>', $horaInicio);
                        })->orWhere(function ($q) use ($horaInicio, $horaFin) {
                            $q->where('hora_inicio', '<', $horaFin)
                              ->where('hora_fin', '>=', $horaFin);
                        })->orWhere(function ($q) use ($horaInicio, $horaFin) {
                            $q->where('hora_inicio', '>=', $horaInicio)
                              ->where('hora_fin', '<=', $horaFin);
                        });
                    })->exists();

                if ($solapamiento) {
                    $validator->errors()->add('hora_inicio', 'Ya existe un bloque horario que se solapa con este rango');
                }
            }
        });
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
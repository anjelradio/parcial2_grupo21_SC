<?php

namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserProfileService
{
    /**
     * Actualiza los datos personales del usuario
     */
    public function updatePersonalInfo($id, array $data)
    {
        $user = User::findOrFail($id);

        $user->update([
            'nombre' => $data['nombre'],
            'apellido_paterno' => $data['apellido_paterno'],
            'apellido_materno' => $data['apellido_materno'],
        ]);

        return $this->buildUserResponse($user);
    }

    /**
     * Cambia la contraseña del usuario
     */
    public function updatePassword($id, array $data)
    {
        $user = User::findOrFail($id);

        // 1️⃣ Verificar contraseña actual
        if (!Hash::check($data['password_actual'], $user->password)) {
            throw ValidationException::withMessages([
                'password_actual' => ['La contraseña actual es incorrecta.'],
            ]);
        }

        // 2️⃣ Confirmar coincidencia entre nuevas contraseñas
        if ($data['password_nueva'] !== $data['password_confirmacion']) {
            throw ValidationException::withMessages([
                'password_confirmacion' => ['Las contraseñas nuevas no coinciden.'],
            ]);
        }

        // 3️⃣ Actualizar contraseña
        $user->password = Hash::make($data['password_nueva']);
        $user->save();

        return $this->buildUserResponse($user);
    }

    /**
     * Retorna datos con el mismo formato que `AuthController@me` y `login`
     */
    private function buildUserResponse(User $user)
    {
        $docente = $user->docente;

        return [
            'id' => $user->id,
            'nombre_completo' => $user->nombre_completo,
            'nombre' => $user->nombre,
            'apellido_paterno' => $user->apellido_paterno,
            'apellido_materno' => $user->apellido_materno,
            'email' => $user->email,
            'rol' => $user->rol,
            'codigo_docente' => $docente?->codigo_docente,
            'profesion' => $docente?->profesion,
        ];
    }
}

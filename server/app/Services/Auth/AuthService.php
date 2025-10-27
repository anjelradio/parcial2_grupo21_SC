<?php

namespace App\Services\Auth;

use App\Models\User;
use App\Models\Docente;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    /**
     * Login con código de docente
     */
    public function loginWithCodigoDocente(string $codigoDocente, string $password)
    {
        // 1. Buscar docente por código
        $docente = Docente::where('codigo_docente', $codigoDocente)->first();

        if (!$docente) {
            throw ValidationException::withMessages([
                'codigo_docente' => ['El código de docente no existe'],
            ]);
        }

        // 2. Obtener usuario asociado
        $user = $docente->user;

        if (!$user) {
            throw ValidationException::withMessages([
                'codigo_docente' => ['Usuario no encontrado'],
            ]);
        }

        // 3. Verificar contraseña
        if (!Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['La contraseña es incorrecta'],
            ]);
        }

        // 4. Verificar rol DOCENTE
        if ($user->rol !== 'DOCENTE') {
            throw ValidationException::withMessages([
                'codigo_docente' => ['Este código no pertenece a un docente'],
            ]);
        }

        // 5. Generar token
        $token = $user->createToken('auth_token')->plainTextToken;

        // 6. Retornar datos
        return [
            'user' => $this->formatUserData($user, $docente),
            'token' => $token,
        ];
    }

    /**
     * Login con email (para Admin y Autoridad)
     */
    public function loginWithEmail(string $email, string $password)
    {
        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales son incorrectas'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $this->formatUserData($user),
            'token' => $token,
        ];
    }

    /**
     * Logout
     */
    public function logout(User $user)
    {
        $user->tokens()->delete();
        return true;
    }

    /**
     * Formatear datos del usuario
     */
    private function formatUserData(User $user, ?Docente $docente = null)
    {
        $data = [
            'id' => $user->id,
            'nombre_completo' => $user->nombre_completo,
            'nombre' => $user->nombre,
            'apellido_paterno' => $user->apellido_paterno,
            'apellido_materno' => $user->apellido_materno,
            'email' => $user->email,
            'rol' => $user->rol,
        ];

        if ($docente) {
            $data['codigo_docente'] = $docente->codigo_docente;
            $data['profesion'] = $docente->profesion;
        }

        return $data;
    }
}
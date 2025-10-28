<?php

namespace App\Services\Auth;

use App\Models\User;
use App\Models\Docente;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class AuthService
{
    /**
     * Login con código de docente
     */
    public function loginWithCodigoDocente(string $codigoDocente, string $password)
    {
        $key = $this->throttleKey($codigoDocente);

        // 1. Revisar si está bloqueado
        if ($this->hasTooManyAttempts($codigoDocente)) {
            throw ValidationException::withMessages([
                'codigo_docente' => ['Cuenta bloqueada temporalmente. Intente nuevamente en 10 minutos.'],
            ]);
        }

        // 2. Buscar docente
        $docente = Docente::where('codigo_docente', $codigoDocente)->first();

        if (!$docente) {
            $this->incrementAttempts($codigoDocente);
            throw ValidationException::withMessages([
                'codigo_docente' => ['El código de docente no existe.'],
            ]);
        }

        // 3. Obtener usuario
        $user = $docente->user;

        if (!$user || !Hash::check($password, $user->password)) {
            $this->incrementAttempts($codigoDocente);
            throw ValidationException::withMessages([
                'password' => ['La contraseña es incorrecta.'],
            ]);
        }

        // 4. Limpiar contador si login correcto
        $this->clearAttempts($codigoDocente);

        // 5. Verificar rol
        if ($user->rol !== 'DOCENTE') {
            throw ValidationException::withMessages([
                'codigo_docente' => ['Este código no pertenece a un docente.'],
            ]);
        }

        // 6. Token
        $token = $user->createToken('auth_token')->plainTextToken;

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
        $key = $this->throttleKey($email);

        if ($this->hasTooManyAttempts($email)) {
            throw ValidationException::withMessages([
                'email' => ['Cuenta bloqueada temporalmente. Intente nuevamente en 10 minutos.'],
            ]);
        }

        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            $this->incrementAttempts($email);
            throw ValidationException::withMessages([
                'email' => ['Las credenciales son incorrectas'],
            ]);
        }

        $this->clearAttempts($email);

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $this->formatUserData($user),
            'token' => $token,
        ];
    }

    /**
     * Manejo de intentos fallidos
     */
    private function throttleKey($identifier)
    {
        return Str::lower("login_attempts:{$identifier}");
    }

    private function hasTooManyAttempts($identifier)
    {
        return Cache::has("locked:{$identifier}");
    }

    private function incrementAttempts($identifier)
    {
        $attempts = Cache::get($this->throttleKey($identifier), 0) + 1;
        Cache::put($this->throttleKey($identifier), $attempts, 600);

        if ($attempts >= 4) {
            Cache::put("locked:{$identifier}", true, 600);
            Cache::forget($this->throttleKey($identifier));
        }
    }

    private function clearAttempts($identifier)
    {
        Cache::forget($this->throttleKey($identifier));
        Cache::forget("locked:{$identifier}");
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

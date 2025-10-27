<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\Auth\AuthService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    use ApiResponse;

    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Login de docente
     */
    public function login(LoginRequest $request)
    {
        try {
            $data = $this->authService->loginWithCodigoDocente(
                $request->codigo_docente,
                $request->password
            );

            return $this->success($data, 'Inicio de sesión exitoso');
            
        } catch (ValidationException $e) {
            return $this->error(
                'Credenciales incorrectas',
                401,
                $e->errors()
            );
        } catch (\Exception $e) {
            return $this->error(
                'Error en el servidor',
                500,
                config('app.debug') ? ['error' => $e->getMessage()] : null
            );
        }
    }

    /**
     * Logout
     */
    public function logout(Request $request)
    {
        try {
            $this->authService->logout($request->user());
            return $this->success(null, 'Sesión cerrada correctamente');
        } catch (\Exception $e) {
            return $this->error('Error al cerrar sesión', 500);
        }
    }

    /**
     * Obtener usuario autenticado
     */
    public function me(Request $request)
    {
        $user = $request->user();
        $docente = $user->docente;

        return $this->success([
            'id' => $user->id,
            'nombre_completo' => $user->nombre_completo,
            'nombre' => $user->nombre,
            'apellido_paterno' => $user->apellido_paterno,
            'apellido_materno' => $user->apellido_materno,
            'email' => $user->email,
            'rol' => $user->rol,
            'codigo_docente' => $docente?->codigo_docente,
            'profesion' => $docente?->profesion,
        ], 'Usuario autenticado');
    }
}
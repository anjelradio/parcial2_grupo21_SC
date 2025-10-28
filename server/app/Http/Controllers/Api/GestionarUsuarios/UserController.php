<?php

namespace App\Http\Controllers\Api\GestionarUsuarios;

use App\Http\Controllers\Controller;
use App\Http\Requests\GestionarUsuarios\StoreUserRequest;
use App\Http\Requests\GestionarUsuarios\UpdateUserRequest;
use App\Services\GestionarUsuarios\UserService;
use App\Traits\ApiResponse;

class UserController extends Controller
{
    use ApiResponse;

    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function index()
    {
        try {
            $users = $this->userService->getAllUsers();
            return $this->success($users, 'Usuarios obtenidos correctamente');
        } catch (\Exception $e) {
            return $this->error('Error al obtener usuarios', 500);
        }
    }

    public function store(StoreUserRequest $request)
    {
        try {
            $userData = $this->userService->createUser($request->validated());
            
            return $this->success(
                $userData,
                'Usuario creado exitosamente',
                201
            );
        } catch (\Exception $e) {
            return $this->error(
                'Error al crear el usuario: ' . $e->getMessage(),
                500
            );
        }
    }

    public function update(UpdateUserRequest $request, $id)
    {
        try {
            $userData = $this->userService->updateUser($id, $request->validated());
            
            return $this->success(
                $userData,
                'Usuario actualizado exitosamente'
            );
        } catch (\Exception $e) {
            return $this->error(
                'Error al actualizar el usuario: ' . $e->getMessage(),
                500
            );
        }
    }

    public function destroy($id)
    {
        try {
            $userData = $this->userService->deleteUser($id);
            
            return $this->success(
                $userData,
                'Usuario eliminado exitosamente'
            );
        } catch (\Exception $e) {
            return $this->error(
                'Error al eliminar el usuario: ' . $e->getMessage(),
                500
            );
        }
    }
}
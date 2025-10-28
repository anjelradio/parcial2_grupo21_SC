<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\UpdatePersonalInfoRequest;
use App\Http\Requests\Auth\UpdatePasswordRequest;
use App\Services\Auth\UserProfileService;
use App\Traits\ApiResponse;
use Illuminate\Validation\ValidationException;

class UserProfileController extends Controller
{
    use ApiResponse;

    protected $userProfileService;

    public function __construct(UserProfileService $userProfileService)
    {
        $this->userProfileService = $userProfileService;
    }

    /**
     * Actualizar información personal (nombre y apellidos)
     */
    public function updatePersonalInfo(UpdatePersonalInfoRequest $request, $id)
    {
        try {
            $data = $this->userProfileService->updatePersonalInfo($id, $request->validated());
            return $this->success($data, 'Información personal actualizada correctamente.');
        } catch (ValidationException $e) {
            $firstError = collect($e->errors())->flatten()->first();
            return $this->error($firstError ?? 'Error de validación.', 422);
        } catch (\Exception $e) {
            return $this->error('Error en el servidor: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Actualizar contraseña
     */
    public function updatePassword(UpdatePasswordRequest $request, $id)
    {
        try {
            $data = $this->userProfileService->updatePassword($id, $request->validated());
            return $this->success($data, 'Contraseña actualizada correctamente.');
        } catch (ValidationException $e) {
            $firstError = collect($e->errors())->flatten()->first();
            return $this->error($firstError ?? 'Error de validación.', 422);
        } catch (\Exception $e) {
            return $this->error('Error en el servidor: ' . $e->getMessage(), 500);
        }
    }
}

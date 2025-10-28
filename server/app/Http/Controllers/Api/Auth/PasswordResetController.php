<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\PasswordResetRequest;
use App\Services\Auth\PasswordResetService;
use App\Traits\ApiResponse;

class PasswordResetController extends Controller
{
    use ApiResponse;

    protected $passwordResetService;

    public function __construct(PasswordResetService $passwordResetService)
    {
        $this->passwordResetService = $passwordResetService;
    }

    public function reset(PasswordResetRequest $request)
    {
        try {
            $result = $this->passwordResetService->resetPassword($request->validated());
            return $this->success($result, 'Correo enviado correctamente.');
        } catch (\Exception $e) {
            return $this->error('Error al intentar recuperar la contraseña: ' . $e->getMessage(), 500);
        }
    }
}

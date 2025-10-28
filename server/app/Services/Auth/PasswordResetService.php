<?php

namespace App\Services\Auth;

use App\Models\User;
use App\Models\Docente;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class PasswordResetService
{
    public function resetPassword(array $data)
    {
        if (!empty($data['codigo_docente'])) {
            // Buscar docente y su usuario
            $docente = Docente::where('codigo_docente', $data['codigo_docente'])->first();
            if (!$docente || !$docente->user) {
                throw ValidationException::withMessages([
                    'codigo_docente' => ['No se encontró un docente con ese código.'],
                ]);
            }
            $user = $docente->user;
        } else {
            // Buscar usuario por email (ADMIN o AUTORIDAD)
            $user = User::where('email', $data['email'])->first();
            if (!$user) {
                throw ValidationException::withMessages([
                    'email' => ['No se encontró un usuario con ese email.'],
                ]);
            }
        }

        // Generar nueva contraseña temporal
        $newPasswordPlain = Str::random(10);
        $user->password = Hash::make($newPasswordPlain);
        $user->save();

        // Enviar correo al usuario
        $this->sendEmail($user, $newPasswordPlain);

        return [
            'email' => $user->email,
            'message' => 'Se ha enviado una nueva contraseña al correo del usuario.',
        ];
    }

    private function sendEmail(User $user, string $plainPassword)
    {
        $data = [
            'nombre' => $user->nombre_completo,
            'password' => $plainPassword,
        ];

        Mail::send('emails.password_reset', $data, function ($message) use ($user) {
            $message->to($user->email)
                    ->subject('Recuperación de contraseña - Sistema de Gestión Docente');
        });
    }
}

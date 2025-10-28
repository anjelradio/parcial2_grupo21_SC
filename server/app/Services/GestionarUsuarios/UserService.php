<?php

namespace App\Services\GestionarUsuarios;

use App\Models\User;
use App\Models\Docente;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserService
{
    /**
     * Obtener todos los usuarios con sus datos de docente si aplica
     */
    public function getAllUsers()
    {
        $users = User::with('docente')->get();
        
        return $users->map(function ($user) {
            return $this->formatUserData($user);
        });
    }

    /**
     * Crear usuario (y docente si aplica)
     */
    public function createUser(array $data)
    {
        return DB::transaction(function () use ($data) {
            // 1. Crear usuario
            $user = User::create([
                'nombre' => $data['nombre'],
                'apellido_paterno' => $data['apellido_paterno'],
                'apellido_materno' => $data['apellido_materno'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'rol' => $data['rol'],
            ]);

            // 2. Si es docente, crear registro en tabla docente
            $docente = null;
            if ($data['rol'] === 'DOCENTE') {
                $codigoDocente = $this->generateCodigoDocente();
                
                $docente = Docente::create([
                    'codigo_docente' => $codigoDocente,
                    'user_id' => $user->id,
                    'profesion' => $data['profesion'] ?? null,
                ]);
            }

            // 3. Retornar datos formateados
            return $this->formatUserData($user->fresh('docente'));
        });
    }

    /**
     * Actualizar usuario
     */
    public function updateUser($id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $user = User::findOrFail($id);
            
            // Actualizar datos básicos del usuario
            $user->update([
                'nombre' => $data['nombre'],
                'apellido_paterno' => $data['apellido_paterno'],
                'apellido_materno' => $data['apellido_materno'],
                'email' => $data['email'],
                'rol' => $data['rol'],
            ]);

            // Si es docente, actualizar sus datos específicos
            if ($data['rol'] === 'DOCENTE' && isset($data['profesion'])) {
                $docente = $user->docente;
                if ($docente) {
                    $docente->update([
                        'profesion' => $data['profesion'],
                    ]);
                }
            }

            return $this->formatUserData($user->fresh('docente'));
        });
    }

    /**
     * Eliminar usuario (y docente en cascada si aplica)
     * Retorna la data del usuario antes de eliminarlo
     */
    public function deleteUser($id)
    {
        return DB::transaction(function () use ($id) {
            $user = User::with('docente')->findOrFail($id);
            
            // Formatear datos antes de eliminar
            $userData = $this->formatUserData($user);
            
            // Si es docente, eliminar primero el registro de docente
            if ($user->isDocente() && $user->docente) {
                $user->docente->delete();
            }
            
            // Eliminar usuario
            $user->delete();
            
            return $userData;
        });
    }

    /**
     * Generar código de docente automáticamente
     * Formato: YYYMMNNN (año 3 dígitos + mes 2 dígitos + correlativo)
     * Ejemplo: 2251063 (año 2025, mes 10, docente #63)
     */
    private function generateCodigoDocente()
    {
        $year = date('Y');
        $month = date('m');
        
        // Año en 3 dígitos (2025 -> 225)
        $yearShort = substr($year, 1);
        
        // Contar docentes existentes
        $count = Docente::count();
        $nextNumber = $count + 1;
        
        // Formatear: YYY + MM + correlativo
        $codigo = $yearShort . $month . $nextNumber;
        
        return $codigo;
    }

    /**
     * Formatear datos del usuario para la respuesta
     */
    private function formatUserData(User $user)
    {
        $data = [
            'id' => $user->id,
            'nombre' => $user->nombre,
            'apellido_paterno' => $user->apellido_paterno,
            'apellido_materno' => $user->apellido_materno,
            'nombre_completo' => $user->nombre_completo,
            'email' => $user->email,
            'rol' => $user->rol,
            'created_at' => $user->created_at?->format('Y-m-d H:i:s'),
        ];

        // Si es docente, incluir sus datos específicos
        if ($user->isDocente() && $user->docente) {
            $data['codigo_docente'] = $user->docente->codigo_docente;
            $data['profesion'] = $user->docente->profesion;
        }

        return $data;
    }
}
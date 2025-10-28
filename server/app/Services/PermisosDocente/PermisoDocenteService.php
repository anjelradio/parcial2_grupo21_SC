<?php

namespace App\Services\PermisosDocente;

use App\Models\PermisoDocente;
use App\Models\Bitacora;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PermisoDocenteService
{
    /**
     * Obtener todos los permisos con información del docente
     */
    public function getAll()
    {
        return PermisoDocente::with('docente.user')->get()->map(function ($permiso) {
            return $this->formatPermisoData($permiso);
        });
    }

    /**
     * Actualizar estado y observaciones de un permiso
     */
    public function update($id, array $data, User $userRevisor)
    {
        return DB::transaction(function () use ($id, $data, $userRevisor) {
            $permiso = PermisoDocente::with('docente.user')->findOrFail($id);
            
            // Guardar estado anterior para la bitácora
            $estadoAnterior = $permiso->estado;
            
            // Actualizar permiso
            $permiso->update([
                'estado' => $data['estado'],
                'observaciones' => $data['observaciones'] ?? $permiso->observaciones,
                'fecha_revision' => Carbon::now()->toDateString(),
            ]);

            // Registrar en bitácora
            $this->registrarEnBitacora($permiso, $estadoAnterior, $userRevisor);

            return $this->formatPermisoData($permiso->fresh('docente.user'));
        });
    }

    /**
     * Registrar la acción en la bitácora
     */
    private function registrarEnBitacora(PermisoDocente $permiso, string $estadoAnterior, User $userRevisor)
    {
        $docente = $permiso->docente->user;
        
        Bitacora::create([
            'user_id' => $userRevisor->id,
            'accion' => 'Actualización de estado de permiso docente',
            'detalles' => json_encode([
                'id_permiso' => $permiso->id_permiso,
                'docente' => $docente->nombre_completo,
                'codigo_docente' => $permiso->codigo_docente,
                'estado_anterior' => $estadoAnterior,
                'estado_nuevo' => $permiso->estado,
                'observaciones' => $permiso->observaciones,
                'fecha_revision' => $permiso->fecha_revision,
            ]),
            'fecha' => Carbon::now(),
        ]);
    }

    /**
     * Formatear datos del permiso para la respuesta
     */
    private function formatPermisoData(PermisoDocente $permiso)
    {
        $docente = $permiso->docente;
        $user = $docente?->user;

        return [
            'id_permiso' => $permiso->id_permiso,
            'codigo_docente' => $permiso->codigo_docente,
            'nombre_docente' => $user?->nombre_completo,
            'documento_evidencia' => $permiso->documento_evidencia,
            'fecha_inicio' => $permiso->fecha_inicio?->format('Y-m-d'),
            'fecha_fin' => $permiso->fecha_fin?->format('Y-m-d'),
            'motivo' => $permiso->motivo,
            'estado' => $permiso->estado,
            'fecha_solicitud' => $permiso->fecha_solicitud?->format('Y-m-d'),
            'fecha_revision' => $permiso->fecha_revision?->format('Y-m-d'),
            'observaciones' => $permiso->observaciones,
        ];
    }
}
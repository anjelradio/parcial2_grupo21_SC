<?php

namespace App\Services\SolicitudesAula;

use App\Models\SolicitudAula;
use App\Models\Bitacora;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SolicitudAulaService
{
    /**
     * Obtener todas las solicitudes con relaciones útiles
     */
    public function getAll()
    {
        return SolicitudAula::with(['asignacion', 'aula'])
            ->orderByDesc('fecha_solicitud')
            ->get()
            ->map(fn($s) => $this->formatSolicitudData($s));
    }

    /**
     * Actualizar el estado y las observaciones
     */
    public function update($id, array $data, User $userRevisor)
    {
        return DB::transaction(function () use ($id, $data, $userRevisor) {
            $solicitud = SolicitudAula::with(['asignacion', 'aula'])->findOrFail($id);
            $estadoAnterior = $solicitud->estado;

            // Actualizar solicitud
            $solicitud->update([
                'estado' => $data['estado'],
                'observaciones' => $data['observaciones'] ?? $solicitud->observaciones,
            ]);

            // Registrar acción en bitácora
            $this->registrarEnBitacora($solicitud, $estadoAnterior, $userRevisor);

            return $this->formatSolicitudData($solicitud->fresh(['asignacion', 'aula']));
        });
    }

    /**
     * Registrar acción en la bitácora
     */
    private function registrarEnBitacora(SolicitudAula $solicitud, string $estadoAnterior, User $userRevisor)
    {
        Bitacora::create([
            'user_id' => $userRevisor->id,
            'accion' => 'Actualización de estado de solicitud de aula',
            'fecha_hora' => Carbon::now(),
            'ip' => request()->ip(),
        ]);
    }

    /**
     * Formatear la solicitud para la respuesta JSON
     */
    private function formatSolicitudData(SolicitudAula $solicitud)
    {
        return [
            'id_solicitud' => $solicitud->id_solicitud,
            'id_asignacion' => $solicitud->id_asignacion,
            'nro_aula' => $solicitud->nro_aula,
            'fecha_solicitada' => $solicitud->fecha_solicitada?->format('Y-m-d'),
            'motivo' => $solicitud->motivo,
            'estado' => $solicitud->estado,
            'fecha_solicitud' => $solicitud->fecha_solicitud?->format('Y-m-d H:i'),
            'observaciones' => $solicitud->observaciones,
            'aula' => $solicitud->aula?->tipo,
            'asignacion' => [
                'id' => $solicitud->asignacion?->id_asignacion,
                'codigo_docente' => $solicitud->asignacion?->codigo_docente,
                'estado' => $solicitud->asignacion?->estado,
            ],
        ];
    }
}

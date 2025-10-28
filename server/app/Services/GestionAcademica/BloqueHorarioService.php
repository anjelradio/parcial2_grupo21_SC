<?php

namespace App\Services\GestionAcademica;

use App\Models\BloqueHorario;
use App\Services\Bitacora\BitacoraService;
use Illuminate\Support\Facades\DB;

class BloqueHorarioService
{
    protected $bitacoraService;

    public function __construct(BitacoraService $bitacoraService)
    {
        $this->bitacoraService = $bitacoraService;
    }

    /**
     * Obtener todos los bloques horarios
     */
    public function getAll()
    {
        return BloqueHorario::orderBy('hora_inicio')->get()->map(function ($bloque) {
            return $this->formatBloqueData($bloque);
        });
    }

    /**
     * Crear nuevo bloque horario
     */
    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            $bloque = BloqueHorario::create([
                'hora_inicio' => $data['hora_inicio'],
                'hora_fin' => $data['hora_fin'],
            ]);

            // Registrar en bitácora
            $this->bitacoraService->registrar(
                "Creó bloque horario: {$bloque->rango()}"
            );

            return $this->formatBloqueData($bloque);
        });
    }

    /**
     * Actualizar bloque horario
     */
    public function update($id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $bloque = BloqueHorario::findOrFail($id);
            $rangoAnterior = $bloque->rango();
            
            $bloque->update([
                'hora_inicio' => $data['hora_inicio'],
                'hora_fin' => $data['hora_fin'],
            ]);

            $bloque = $bloque->fresh();

            // Registrar en bitácora
            $this->bitacoraService->registrar(
                "Modificó bloque horario de '{$rangoAnterior}' a '{$bloque->rango()}'"
            );

            return $this->formatBloqueData($bloque);
        });
    }

    /**
     * Eliminar bloque horario
     */
    public function delete($id)
    {
        return DB::transaction(function () use ($id) {
            $bloque = BloqueHorario::findOrFail($id);
            $rangoEliminado = $bloque->rango();
            $bloqueData = $this->formatBloqueData($bloque);
            
            $bloque->delete();

            // Registrar en bitácora
            $this->bitacoraService->registrar(
                "Eliminó bloque horario: {$rangoEliminado}"
            );
            
            return $bloqueData;
        });
    }

    /**
     * Formatear datos del bloque
     */
    private function formatBloqueData(BloqueHorario $bloque)
    {
        return [
            'id_bloque' => $bloque->id_bloque,
            'hora_inicio' => $bloque->hora_inicio->format('H:i'),
            'hora_fin' => $bloque->hora_fin->format('H:i'),
            'rango' => $bloque->rango(),
        ];
    }
}
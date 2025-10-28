<?php

namespace App\Services\GestionAcademica;

use App\Models\Dia;
use App\Services\Bitacora\BitacoraService;
use Illuminate\Support\Facades\DB;

class DiaService
{
    protected $bitacoraService;

    public function __construct(BitacoraService $bitacoraService)
    {
        $this->bitacoraService = $bitacoraService;
    }

    /**
     * Obtener todos los días
     */
    public function getAll()
    {
        return Dia::all()->map(function ($dia) {
            return $this->formatDiaData($dia);
        });
    }

    /**
     * Crear nuevo día
     */
    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            $dia = Dia::create([
                'nombre' => ucfirst(strtolower($data['nombre'])),
            ]);

            // Registrar en bitácora
            $this->bitacoraService->registrar(
                "Creó día académico: {$dia->nombre}"
            );

            return $this->formatDiaData($dia);
        });
    }

    /**
     * Actualizar día
     */
    public function update($id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $dia = Dia::findOrFail($id);
            $nombreAnterior = $dia->nombre;
            
            $dia->update([
                'nombre' => ucfirst(strtolower($data['nombre'])),
            ]);

            $dia = $dia->fresh();

            // Registrar en bitácora
            $this->bitacoraService->registrar(
                "Modificó día académico de '{$nombreAnterior}' a '{$dia->nombre}'"
            );

            return $this->formatDiaData($dia);
        });
    }

    /**
     * Eliminar día
     */
    public function delete($id)
    {
        return DB::transaction(function () use ($id) {
            $dia = Dia::findOrFail($id);
            $nombreEliminado = $dia->nombre;
            $diaData = $this->formatDiaData($dia);
            
            $dia->delete();

            // Registrar en bitácora
            $this->bitacoraService->registrar(
                "Eliminó día académico: {$nombreEliminado}"
            );
            
            return $diaData;
        });
    }

    /**
     * Formatear datos del día
     */
    private function formatDiaData(Dia $dia)
    {
        return [
            'id_dia' => $dia->id_dia,
            'nombre' => $dia->nombre,
        ];
    }
}
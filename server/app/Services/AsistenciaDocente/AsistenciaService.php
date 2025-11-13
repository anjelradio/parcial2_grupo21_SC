<?php

namespace App\Services\AsistenciaDocente;

use App\Models\Asignacion;
use App\Models\Suplencia;
use App\Models\DetalleHorario;
use App\Models\BloqueHorario;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AsistenciaService
{
    // Parámetros de negocio para ventanas de tiempo
    const MINUTOS_ANTES = 15;
    const MINUTOS_PRESENTE = 15;
    const MINUTOS_MAX_ATRASO = 30;

    /**
     * Encuentra la asignación y detalle de horario válido para un docente
     * en la fecha/hora actual
     */
    public function encontrarAsignacionValida(string $codigoDocente, int $idGestion)
    {
        $ahora = Carbon::now();
        $fechaActual = $ahora->toDateString();
        $horaActual = $ahora->format('H:i:s');
        $diaSemanaIso = $ahora->dayOfWeekIso; // 1=lunes, 7=domingo

        // Mapear día ISO a id_dia (asumiendo 1=lunes...6=sábado en tabla Dia)
        $idDia = $diaSemanaIso <= 6 ? $diaSemanaIso : null;
        
        if (!$idDia) {
            return [
                'success' => false,
                'message' => 'No hay clases programadas los domingos'
            ];
        }

        // 1️⃣ INTENTAR COMO TITULAR
        $resultado = $this->buscarComoTitular($codigoDocente, $idGestion, $idDia, $horaActual);
        
        if ($resultado['success']) {
            return $resultado;
        }

        // 2️⃣ INTENTAR COMO SUPLENTE
        $resultado = $this->buscarComoSuplente($codigoDocente, $fechaActual, $idDia, $horaActual);
        
        if ($resultado['success']) {
            return $resultado;
        }

        return [
            'success' => false,
            'message' => 'No se encontró ninguna clase programada para este momento'
        ];
    }

    /**
     * Busca asignación como docente titular
     */
    private function buscarComoTitular(string $codigoDocente, int $idGestion, int $idDia, string $horaActual)
    {
        $asignaciones = Asignacion::where('codigo_docente', $codigoDocente)
            ->where('id_gestion', $idGestion)
            ->where('estado', 'Vigente')
            ->with(['detallesHorario.bloque', 'detallesHorario.dia'])
            ->get();

        foreach ($asignaciones as $asignacion) {
            $detalleValido = $this->encontrarDetalleHorarioValido(
                $asignacion->detallesHorario,
                $idDia,
                $horaActual
            );

            if ($detalleValido) {
                return [
                    'success' => true,
                    'asignacion' => $asignacion,
                    'detalle_horario' => $detalleValido['detalle'],
                    'estado' => $detalleValido['estado'],
                    'marcado_por' => 'Titular'
                ];
            }
        }

        return ['success' => false];
    }

    /**
     * Busca asignación como docente suplente
     */
    private function buscarComoSuplente(string $codigoDocente, string $fechaActual, int $idDia, string $horaActual)
    {
        $suplencias = Suplencia::where('cod_suplente', $codigoDocente)
            ->where('estado', 'Activa')
            ->where('fecha_inicio', '<=', $fechaActual)
            ->where('fecha_fin', '>=', $fechaActual)
            ->with(['asignacion.detallesHorario.bloque', 'asignacion.detallesHorario.dia'])
            ->get();

        foreach ($suplencias as $suplencia) {
            $asignacion = $suplencia->asignacion;
            
            if (!$asignacion) continue;

            $detalleValido = $this->encontrarDetalleHorarioValido(
                $asignacion->detallesHorario,
                $idDia,
                $horaActual
            );

            if ($detalleValido) {
                return [
                    'success' => true,
                    'asignacion' => $asignacion,
                    'detalle_horario' => $detalleValido['detalle'],
                    'estado' => $detalleValido['estado'],
                    'marcado_por' => 'Suplente'
                ];
            }
        }

        return ['success' => false];
    }

    /**
     * Encuentra el detalle de horario válido para el día y hora actual
     * Maneja correctamente clases seguidas
     */
    private function encontrarDetalleHorarioValido($detallesHorario, int $idDia, string $horaActual)
    {
        $candidatos = [];

        foreach ($detallesHorario as $detalle) {
            // Filtrar por día
            if ($detalle->id_dia != $idDia) {
                continue;
            }

            $bloque = $detalle->bloque;
            if (!$bloque) continue;

            // Convertir horas a Carbon para cálculos
            $horaInicio = Carbon::parse(trim($bloque->hora_inicio));
            $horaActualCarbon = Carbon::parse($horaActual);

            // Calcular ventanas de tiempo
            $ventanaInicio = $horaInicio->copy()->subMinutes(self::MINUTOS_ANTES);
            $ventanaFin = $horaInicio->copy()->addMinutes(self::MINUTOS_MAX_ATRASO);

            // Verificar si está dentro de la ventana válida
            if ($horaActualCarbon->lt($ventanaInicio) || $horaActualCarbon->gt($ventanaFin)) {
                continue; // Fuera de rango
            }

            // Calcular diferencia en minutos desde hora_inicio
            $diferenciaMinutos = $horaActualCarbon->diffInMinutes($horaInicio, false);

            // Determinar estado
            $estado = 'Presente';
            if ($diferenciaMinutos > self::MINUTOS_PRESENTE) {
                $estado = 'Retraso';
            }

            // Agregar como candidato con su diferencia absoluta
            $candidatos[] = [
                'detalle' => $detalle,
                'estado' => $estado,
                'diferencia_abs' => abs($diferenciaMinutos)
            ];
        }

        // Si no hay candidatos
        if (empty($candidatos)) {
            return null;
        }

        // Ordenar candidatos por diferencia absoluta (el más cercano primero)
        usort($candidatos, function($a, $b) {
            return $a['diferencia_abs'] <=> $b['diferencia_abs'];
        });

        // Retornar el más cercano
        return $candidatos[0];
    }

    /**
     * Calcula distancia entre dos puntos GPS usando Haversine
     * Retorna distancia en metros
     */
    public function calcularDistanciaHaversine(float $lat1, float $lng1, float $lat2, float $lng2): float
    {
        $radioTierra = 6371000; // metros

        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLng / 2) * sin($dLng / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $radioTierra * $c;
    }
}
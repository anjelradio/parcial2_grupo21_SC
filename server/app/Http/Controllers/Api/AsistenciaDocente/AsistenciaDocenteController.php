<?php

namespace App\Http\Controllers\Api\AsistenciaDocente;

use App\Http\Controllers\Controller;
use App\Http\Requests\AsistenciaDocente\RegistrarAsistenciaPresencialRequest;
use App\Http\Requests\AsistenciaDocente\RegistrarAsistenciaVirtualRequest;
use App\Services\AsistenciaDocente\AsistenciaService;
use App\Services\CloudinaryService;
use App\Models\Docente;
use App\Models\QrGestion;
use App\Models\UbicacionFacultad;
use App\Models\TipoAsistencia;
use App\Models\AsistenciaDocente;
use App\Models\EvidenciaAsistencia;
use App\Models\User;
use App\Traits\ApiResponse;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AsistenciaDocenteController extends Controller
{
    use ApiResponse;

    private $asistenciaService;
    private $cloudinaryService;

    public function __construct(AsistenciaService $asistenciaService, CloudinaryService $cloudinaryService)
    {
        $this->asistenciaService = $asistenciaService;
        $this->cloudinaryService = $cloudinaryService;
    }

    /**
     * POST /api/docentes/{user_id}/asistencias/presencial
     */
    public function registrarPresencial(RegistrarAsistenciaPresencialRequest $request, int $userId)
    {
        try {
            DB::beginTransaction();

            // 1️⃣ Verificar que el usuario existe y es docente
            $user = User::find($userId);
            if (!$user) {
                return $this->error('Usuario no encontrado', 404);
            }

            $docente = $user->docente;
            if (!$docente) {
                return $this->error('El usuario no está registrado como docente', 404);
            }

            $codigoDocente = $docente->codigo_docente;

            // 2️⃣ Validar token QR
            $qrGestion = QrGestion::where('token', $request->token_qr)
                ->where('activo', true)
                ->first();

            if (!$qrGestion) {
                return $this->error('Token QR inválido o inactivo', 400);
            }

            // Verificar que la gestión está vigente
            $gestion = $qrGestion->gestion;
            if (!$gestion) {
                return $this->error('Gestión académica no encontrada', 404);
            }

            $fechaActual = Carbon::now()->toDateString();
            if ($fechaActual < $gestion->fecha_inicio || $fechaActual > $gestion->fecha_fin) {
                return $this->error('La gestión académica no está vigente', 400);
            }

            // 3️⃣ Validar ubicación GPS
            $ubicacion = UbicacionFacultad::first();
            if (!$ubicacion) {
                return $this->error('No se ha configurado la ubicación de la facultad', 500);
            }

            $distancia = $this->asistenciaService->calcularDistanciaHaversine(
                $request->lat,
                $request->lng,
                $ubicacion->latitud,
                $ubicacion->longitud
            );

            if ($distancia > $ubicacion->radio_permitido) {
                return $this->error(
                    'Estás fuera del rango permitido para marcar asistencia presencial',
                    400,
                    ['distancia_metros' => round($distancia, 2)]
                );
            }

            // 4️⃣ Encontrar asignación válida
            $resultado = $this->asistenciaService->encontrarAsignacionValida(
                $codigoDocente,
                $gestion->id_gestion
            );

            if (!$resultado['success']) {
                return $this->error($resultado['message'], 404);
            }

            // 5️⃣ Verificar si ya existe asistencia para esta asignación hoy
            $yaRegistrado = AsistenciaDocente::where('id_asignacion', $resultado['asignacion']->id_asignacion)
                ->whereDate('fecha', Carbon::now()->toDateString())
                ->where('hora_registro', '>=', $resultado['detalle_horario']->bloque->hora_inicio)
                ->where('hora_registro', '<=', $resultado['detalle_horario']->bloque->hora_fin)
                ->exists();

            if ($yaRegistrado) {
                return $this->error('Ya existe un registro de asistencia para esta clase', 400);
            }

            // 6️⃣ Obtener tipo de asistencia "Presencial"
            $tipoPresencial = TipoAsistencia::where('nombre', 'Presencial')->first();
            if (!$tipoPresencial) {
                return $this->error('Tipo de asistencia presencial no encontrado en el sistema', 500);
            }

            // 7️⃣ Crear registro de asistencia
            $asistencia = AsistenciaDocente::create([
                'id_asignacion' => $resultado['asignacion']->id_asignacion,
                'id_tipo_asistencia' => $tipoPresencial->id_tipo,
                'fecha' => Carbon::now()->toDateString(),
                'hora_registro' => Carbon::now(),
                'estado' => $resultado['estado'], // "Presente" o "Retraso"
                'marcado_por' => $resultado['marcado_por'], // "Titular" o "Suplente"
            ]);

            DB::commit();

            // Cargar relaciones para la respuesta
            $asistencia->load(['asignacion.grupo.materia', 'tipoAsistencia']);

            return $this->success([
                'asistencia' => [
                    'id_asistencia' => $asistencia->id_asistencia,
                    'fecha' => $asistencia->fecha,
                    'hora_registro' => $asistencia->hora_registro->format('H:i:s'),
                    'estado' => $asistencia->estado,
                    'marcado_por' => $asistencia->marcado_por,
                    'tipo' => $asistencia->tipoAsistencia->nombre,
                    'materia' => $asistencia->asignacion->grupo->materia->nombre ?? 'N/A',
                    'grupo' => $asistencia->asignacion->grupo->nombre ?? 'N/A',
                ],
                'evidencia' => null
            ], 'Asistencia presencial registrada correctamente', 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('Error al registrar asistencia presencial: ' . $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/docentes/{user_id}/asistencias/virtual
     */
    public function registrarVirtual(RegistrarAsistenciaVirtualRequest $request, int $userId)
    {
        try {
            DB::beginTransaction();

            // 1️⃣ Verificar que el usuario existe y es docente
            $user = User::find($userId);
            if (!$user) {
                return $this->error('Usuario no encontrado', 404);
            }

            $docente = $user->docente;
            if (!$docente) {
                return $this->error('El usuario no está registrado como docente', 404);
            }

            $codigoDocente = $docente->codigo_docente;

            // 2️⃣ Validación extra de confianza (por seguridad)
            if ($request->confianza < 60) {
                return $this->error('El nivel de confianza es demasiado bajo para registrar asistencia virtual', 400);
            }

            // 3️⃣ Obtener gestión académica vigente
            $fechaActual = Carbon::now()->toDateString();
            $gestion = \App\Models\GestionAcademica::where('fecha_inicio', '<=', $fechaActual)
                ->where('fecha_fin', '>=', $fechaActual)
                ->first();

            if (!$gestion) {
                return $this->error('No hay gestión académica vigente', 404);
            }

            // 4️⃣ Encontrar asignación válida
            $resultado = $this->asistenciaService->encontrarAsignacionValida(
                $codigoDocente,
                $gestion->id_gestion
            );

            if (!$resultado['success']) {
                return $this->error($resultado['message'], 404);
            }

            // 5️⃣ Verificar si ya existe asistencia para esta asignación hoy
            $yaRegistrado = AsistenciaDocente::where('id_asignacion', $resultado['asignacion']->id_asignacion)
                ->whereDate('fecha', Carbon::now()->toDateString())
                ->where('hora_registro', '>=', $resultado['detalle_horario']->bloque->hora_inicio)
                ->where('hora_registro', '<=', $resultado['detalle_horario']->bloque->hora_fin)
                ->exists();

            if ($yaRegistrado) {
                return $this->error('Ya existe un registro de asistencia para esta clase', 400);
            }

            // 6️⃣ Obtener tipo de asistencia "Virtual"
            $tipoVirtual = TipoAsistencia::where('nombre', 'Virtual')->first();
            if (!$tipoVirtual) {
                return $this->error('Tipo de asistencia virtual no encontrado en el sistema', 500);
            }

            // 7️⃣ Crear registro de asistencia (sin evidencia aún)
            $asistencia = AsistenciaDocente::create([
                'id_asignacion' => $resultado['asignacion']->id_asignacion,
                'id_tipo_asistencia' => $tipoVirtual->id_tipo,
                'fecha' => Carbon::now()->toDateString(),
                'hora_registro' => Carbon::now(),
                'estado' => $resultado['estado'], // Usar el estado calculado por el servicio
                'marcado_por' => $resultado['marcado_por'],
            ]);

            // 8️⃣ Subir imagen a Cloudinary
            $uploadResult = $this->cloudinaryService->subirEvidenciaAsistencia(
                $request->file('file'),
                $codigoDocente,
                $resultado['asignacion']->id_asignacion,
                $asistencia->id_asistencia
            );

            if (!$uploadResult['success']) {
                DB::rollBack();
                return $this->error('Error al subir la evidencia: ' . $uploadResult['error'], 500);
            }

            // 9️⃣ Crear registro de evidencia
            $evidencia = EvidenciaAsistencia::create([
                'id_asistencia' => $asistencia->id_asistencia,
                'imagen' => $uploadResult['url'],
                'confianza' => $request->confianza,
                'fecha_subida' => Carbon::now(),
                'motivo' => $request->motivo, // Cambiado de 'observaciones' a 'motivo'
            ]);

            DB::commit();

            // Cargar relaciones para la respuesta
            $asistencia->load(['asignacion.grupo.materia', 'tipoAsistencia']);

            return $this->success([
                'asistencia' => [
                    'id_asistencia' => $asistencia->id_asistencia,
                    'fecha' => $asistencia->fecha,
                    'hora_registro' => $asistencia->hora_registro->format('H:i:s'),
                    'estado' => $asistencia->estado,
                    'marcado_por' => $asistencia->marcado_por,
                    'tipo' => $asistencia->tipoAsistencia->nombre,
                    'materia' => $asistencia->asignacion->grupo->materia->nombre ?? 'N/A',
                    'grupo' => $asistencia->asignacion->grupo->nombre ?? 'N/A',
                ],
                'evidencia' => [
                    'id_evidencia' => $evidencia->id_evidencia,
                    'imagen_url' => $evidencia->imagen,
                    'confianza' => $evidencia->confianza,
                    'motivo' => $evidencia->motivo,
                    'fecha_subida' => $evidencia->fecha_subida->format('Y-m-d H:i:s'),
                ]
            ], 'Asistencia virtual registrada correctamente', 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('Error al registrar asistencia virtual: ' . $e->getMessage(), 500);
        }
    }
}
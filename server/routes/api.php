<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\GestionarUsuarios\UserController;
use App\Http\Controllers\Api\GestionAcademica\MateriaController;
use App\Http\Controllers\Api\GestionAcademica\GrupoController;
use App\Http\Controllers\Api\GestionAcademica\AulaController;
use App\Http\Controllers\Api\GestionAcademica\BloqueHorarioController;
use App\Http\Controllers\Api\GestionAcademica\DiaController;
use App\Http\Controllers\Api\Asignaciones\AsignacionController;
use App\Http\Controllers\Api\PermisosDocente\PermisoDocenteController;
use App\Http\Controllers\Api\Suplencias\SuplenciaController;
use App\Http\Controllers\Api\SolicitudesAula\SolicitudAulaController;
use App\Http\Controllers\Api\Auth\UserProfileController;
use App\Http\Controllers\Api\Auth\PasswordResetController;
use App\Http\Controllers\Api\Estadisticas\EstadisticasController;
use App\Http\Controllers\Api\AsistenciaDocente\AsistenciaDocenteController;
use App\Http\Controllers\Api\ConsultaGestion\GestionController;
use App\Http\Controllers\Api\ConsultaGestion\EstadisticaController;
use App\Http\Controllers\Api\ConsultaGestion\DocenteController;
use App\Http\Controllers\Api\ConsultaGestion\GrupoMateriaController;
use App\Http\Controllers\Api\ConsultaGestion\AsignacionReporteController;
use App\Http\Controllers\Api\SupervisionAsistencias\EstadisticaSupAsistenciaController;
use App\Http\Controllers\Api\SupervisionAsistencias\AsignacionSupAsistenciaController;


use App\Http\Controllers\Api\Bitacora\BitacoraController;
use App\Http\Controllers\Api\Utilidades\UtilidadesController;
use App\Http\Controllers\QrController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ==========================================
// RUTAS PÚBLICAS
// ==========================================
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [PasswordResetController::class, 'reset']);
    Route::put('/update-personal-info/{id}', [UserProfileController::class, 'updatePersonalInfo']);
    Route::put('/update-password/{id}', [UserProfileController::class, 'updatePassword']);
});

Route::prefix('consulta-gestion')->group(function () {
    Route::get('/semestres', [GestionController::class, 'listarSemestres']);
    Route::get('/{id_gestion}/estadisticas', [EstadisticaController::class, 'obtenerEstadisticas']);
    Route::get('/{id_gestion}/docentes', [DocenteController::class, 'index']);
    Route::get('/{id_gestion}/grupos', [GrupoMateriaController::class, 'index']);
    Route::get('/{id_gestion}/docentes/reporte', [DocenteController::class, 'generarReporte']);
    Route::get('/{id_gestion}/grupos/reporte', [GrupoMateriaController::class, 'generarReporte']);
    Route::get('/{id_gestion}/asignaciones/reporte', [AsignacionReporteController::class, 'generarReporte']);
    Route::get('/{id_gestion}/asignaciones/reporte-pdf', [AsignacionReporteController::class, 'generarReportePDF']);
});

// ==========================================
// RUTAS PROTEGIDAS (requieren autenticación)
// ==========================================
Route::middleware('auth:sanctum')->group(function () {


    // Auth
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });


    //CRUD DE USUARIOS
    Route::prefix('users')->middleware('check.admin')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/create', [UserController::class, 'store']);
        Route::put('/update/{id}', [UserController::class, 'update']);
        Route::delete('/delete/{id}', [UserController::class, 'destroy']);
    });

    // CRUD DE MATERIAS
    Route::prefix('materias')->group(function () {
        Route::get('/', [MateriaController::class, 'index']);
        Route::post('/create', [MateriaController::class, 'create']);
        Route::put('/update/{id}', [MateriaController::class, 'update']);
        Route::delete('/delete/{id}', [MateriaController::class, 'delete']);
    });

    // CRUD DE GRUPOS
    Route::prefix('grupos')->group(function () {
        Route::get('/', [GrupoController::class, 'index']);
        Route::post('/create', [GrupoController::class, 'create']);
        Route::put('/update/{id}', [GrupoController::class, 'update']);
        Route::delete('/delete/{id}', [GrupoController::class, 'delete']);
    });

    // CRUD DE AULAS
    Route::prefix('aulas')->group(function () {
        Route::get('/', [AulaController::class, 'index']);
        Route::post('/create', [AulaController::class, 'create']);
        Route::put('/update/{nroAula}', [AulaController::class, 'update']);
        Route::delete('/delete/{nroAula}', [AulaController::class, 'delete']);
    });

    // CRUD DE BLOQUES HORARIOS 
    Route::prefix('bloques-horarios')->middleware('check.admin')->group(function () {
        Route::get('/', [BloqueHorarioController::class, 'index']);
        Route::post('/create', [BloqueHorarioController::class, 'create']);
        Route::put('/update/{id}', [BloqueHorarioController::class, 'update']);
        Route::delete('/delete/{id}', [BloqueHorarioController::class, 'delete']);
    });

    // CRUD DE DÍAS ACADÉMICOS 
    Route::prefix('dias')->middleware('check.admin')->group(function () {
        Route::get('/', [DiaController::class, 'index']);
        Route::post('/create', [DiaController::class, 'create']);
        Route::put('/update/{id}', [DiaController::class, 'update']);
        Route::delete('/delete/{id}', [DiaController::class, 'delete']);
    });

    // CRUD DE ASIGNACIONES 
    Route::prefix('asignaciones')->middleware('check.admin')->group(function () {
        Route::get('/', [AsignacionController::class, 'index']);
        Route::post('/create', [AsignacionController::class, 'create']);
        Route::put('/update/{id}', [AsignacionController::class, 'update']);
        Route::delete('/delete/{id}', [AsignacionController::class, 'delete']);
    });

    // PERMISOS DOCENTE
    Route::prefix('permisos-docente')->group(function () {
        // Listar todos los permisos (ADMIN y AUTORIDAD)
        Route::get('/', [PermisoDocenteController::class, 'index']);

        // Actualizar estado y observaciones (ADMIN y AUTORIDAD)
        Route::put('/update/{id}', [PermisoDocenteController::class, 'update']);
    });

    // SUPLENCIAS DOCENTES
    Route::prefix('suplencias')->group(function () {
        Route::get('/', [SuplenciaController::class, 'index']);
        Route::post('/create', [SuplenciaController::class, 'create']);
        Route::put('/update/{id}', [SuplenciaController::class, 'update']);
        Route::delete('/delete/{id}', [SuplenciaController::class, 'delete']);
    });

    Route::prefix('solicitudes-aula')->group(function () {
        Route::get('/', [SolicitudAulaController::class, 'index']);
        Route::put('/update/{id}', [SolicitudAulaController::class, 'update']);
    });

    // BITÁCORA 
    Route::prefix('bitacora')->middleware('check.admin')->group(function () {
        Route::get('/', [BitacoraController::class, 'index']);
        Route::get('/usuario/{userId}', [BitacoraController::class, 'porUsuario']);
        Route::get('/buscar', [BitacoraController::class, 'buscar']);
    });

    // STATS
    Route::prefix('estadisticas')->group(function () {
        Route::get('/globales', [EstadisticasController::class, 'index']);
        Route::get('/control-docente', [EstadisticasController::class, 'controlDocente']);
    });

    // UTILIDADES
    Route::prefix('utilidades')->group(function () {
        Route::get('/semestres', [UtilidadesController::class, 'getSemestres']);
        Route::get('/docentes', [UtilidadesController::class, 'getDocentes']);
        Route::get('/asignaciones/{codigo_docente}', [UtilidadesController::class, 'getAsignacionesPorDocente']);
    });

    Route::prefix('docentes/{user_id}/asistencias')->group(function () {
        // Registrar asistencia presencial (QR + GPS)
        Route::post('/presencial', [AsistenciaDocenteController::class, 'registrarPresencial'])
            ->name('asistencias.presencial');

        // Registrar asistencia virtual (IA + screenshot)
        Route::post('/virtual', [AsistenciaDocenteController::class, 'registrarVirtual'])
            ->name('asistencias.virtual');
    });


    Route::prefix('supervision-asistencias')->group(function () {
        Route::get('/estadisticas/{id_gestion?}', [EstadisticaSupAsistenciaController::class, 'obtenerEstadisticas']);
    });

    Route::prefix('supervision-asistencias')->group(function () {

        Route::get(
            '/estadisticas/{id_gestion?}',
            [EstadisticaSupAsistenciaController::class, 'obtenerEstadisticas']
        );

        Route::get(
            '/asignacion/{id_asignacion}',
            [AsignacionSupAsistenciaController::class, 'obtenerDetalle']
        );
    });






    Route::post('/qr/generar', [QrController::class, 'generar']);
});

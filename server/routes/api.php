<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\GestionarUsuarios\UserController;
use App\Http\Controllers\Api\GestionAcademica\MateriaController;
use App\Http\Controllers\Api\GestionAcademica\GrupoController;
use App\Http\Controllers\Api\GestionAcademica\AulaController;


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


    // Rutas de gestión de usuarios (solo ADMIN)
    Route::prefix('users')->middleware('check.admin')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/', [UserController::class, 'store']);
        Route::put('/{id}', [UserController::class, 'update']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
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
});



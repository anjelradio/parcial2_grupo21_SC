<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GestionAcademica extends Model
{
    protected $table = 'gestion_academica';
    protected $primaryKey = 'id_gestion';

    protected $fillable = [
        'anio',
        'semestre',
        'fecha_inicio',
        'fecha_fin',
    ];

    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
    ];

    public function asignaciones()
    {
        return $this->hasMany(Asignacion::class, 'id_gestion');
    }

    public function importaciones()
    {
        return $this->hasMany(ImportacionUsuarios::class, 'id_gestion');
    }

    // Helper: Obtener nombre completo de la gestión
    public function getNombreGestionAttribute()
    {
        return "{$this->anio}-{$this->semestre}";
    }
}
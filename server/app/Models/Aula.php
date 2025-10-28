<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Aula extends Model
{
    use HasFactory;

    protected $table = 'aula';
    protected $primaryKey = 'nro_aula';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    protected $fillable = [
        'nro_aula',
        'tipo',
        'capacidad',
        'estado',
    ];

    protected $casts = [
        'capacidad' => 'integer',
    ];

    // RELACIONES
    public function detalles()
    {
        return $this->hasMany(DetalleHorario::class, 'nro_aula', 'nro_aula');
    }

    // HELPERS
    // Mostrar descripción legible
    public function getDescripcionAttribute()
    {
        return "{$this->tipo} {$this->nro_aula} ({$this->estado})";
    }

    // SCOPES
    // Solo aulas disponibles
    public function scopeDisponibles($query)
    {
        return $query->where('estado', 'Disponible');
    }

    // Scope: por tipo (Aula, Laboratorio, Auditorio)
    public function scopeDeTipo($query, $tipo)
    {
        return $query->where('tipo', $tipo);
    }

    
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class GestionAcademica extends Model
{
    use HasFactory;

    protected $table = 'gestion_academica';
    protected $primaryKey = 'id_gestion';
    public $timestamps = false;

    protected $fillable = [
        'anio',
        'semestre',
        'fecha_inicio',
        'fecha_fin',
        'estado',
    ];

    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
        'anio' => 'integer',
        'semestre' => 'integer',
        'estado' => 'string',
    ];

    // RELACIONES
    public function asignaciones()
    {
        return $this->hasMany(Asignacion::class, 'id_gestion', 'id_gestion');
    }

    public function qrGestion()
    {
        return $this->hasOne(QrGestion::class, 'id_gestion', 'id_gestion');
    }

    public function importaciones()
    {
        return $this->hasMany(ImportacionUsuarios::class, 'id_gestion', 'id_gestion');
    }

    // SCOPES
    public function scopeVigente($query)
    {
        $hoy = Carbon::now()->toDateString();
        return $query->where('fecha_inicio', '<=', $hoy)
                    ->where('fecha_fin', '>=', $hoy);
    }

    public function scopePorAnio($query, $anio)
    {
        return $query->where('anio', $anio);
    }

    public function scopePorSemestre($query, $semestre)
    {
        return $query->where('semestre', $semestre);
    }

    // HELPERS
    public function esVigente()
    {
        $hoy = Carbon::now()->toDateString();
        return $hoy >= $this->fecha_inicio && $hoy <= $this->fecha_fin;
    }

    public function descripcion()
    {
        return "{$this->anio} - {$this->semestre}° Semestre";
    }

    public function getNombreCompletoAttribute()
    {
        return "Gestión {$this->anio}/{$this->semestre}";
    }
}
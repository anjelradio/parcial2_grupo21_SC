<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetalleHorario extends Model
{
    use HasFactory;

    protected $table = 'detalle_horario';
    protected $primaryKey = 'id_detallehorario';

    protected $fillable = [
        'id_asignacion',
        'nro_aula',
        'id_dia',
        'id_bloque',
    ];

    //  RELACIONES
    public function asignacion()
    {
        return $this->belongsTo(Asignacion::class, 'id_asignacion', 'id_asignacion');
    }

    public function aula()
    {
        return $this->belongsTo(Aula::class, 'nro_aula', 'nro_aula');
    }

    public function dia()
    {
        return $this->belongsTo(Dia::class, 'id_dia', 'id_dia');
    }

    public function bloque()
    {
        return $this->belongsTo(BloqueHorario::class, 'id_bloque', 'id_bloque');
    }

    // HELPERS
    // Mostrar descripción legible del horario
    public function getDescripcionAttribute()
    {
        $dia = $this->dia ? $this->dia->nombre : 'Sin día';
        $bloque = $this->bloque ? $this->bloque->rango() : 'Sin hora';
        $aula = $this->aula ? "Aula {$this->aula->nro_aula}" : 'Sin aula';
        return "{$dia} ({$bloque}) - {$aula}";
    }

    //  SCOPES
    // Filtrar por día
    public function scopeDelDia($query, $nombreDia)
    {
        return $query->whereHas('dia', fn($q) => $q->where('nombre', $nombreDia));
    }

    
}

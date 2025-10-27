<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Suplencia extends Model
{
    use HasFactory;

    protected $table = 'suplencia';
    protected $primaryKey = 'id_suplencia';

    protected $fillable = [
        'cod_titular',
        'cod_suplente',
        'id_asignacion',
        'motivo',
        'fecha_inicio',
        'fecha_fin',
        'estado',
        'fecha_registro',
    ];

    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
        'fecha_registro' => 'datetime',
    ];

    // RELACIONES

    public function titular()
    {
        return $this->belongsTo(Docente::class, 'cod_titular', 'codigo_docente');
    }

    public function suplente()
    {
        return $this->belongsTo(Docente::class, 'cod_suplente', 'codigo_docente');
    }

    public function asignacion()
    {
        return $this->belongsTo(Asignacion::class, 'id_asignacion', 'id_asignacion');
    }

    // SCOPES

    public function scopeActivas($query)
    {
        return $query->where('estado', 'Activa');
    }

    public function scopeFinalizadas($query)
    {
        return $query->where('estado', 'Finalizada');
    }

    public function scopeEnRango($query, $fecha)
    {
        return $query->whereDate('fecha_inicio', '<=', $fecha)
                     ->whereDate('fecha_fin', '>=', $fecha);
    }

    // HELPERS

    public function esActiva()
    {
        return $this->estado === 'Activa';
    }

    public function esFinalizada()
    {
        return $this->estado === 'Finalizada';
    }

    public function esCancelada()
    {
        return $this->estado === 'Cancelada';
    }

    public function duracionDias()
    {
        return $this->fecha_inicio && $this->fecha_fin
            ? $this->fecha_inicio->diffInDays($this->fecha_fin)
            : 0;
    }

    public function descripcion()
    {
        $titular = $this->titular?->user?->nombre_completo ?? 'Desconocido';
        $suplente = $this->suplente?->user?->nombre_completo ?? 'Desconocido';
        $rango = "{$this->fecha_inicio->format('d/m')} - {$this->fecha_fin->format('d/m')}";
        return "Reemplazo de {$titular} por {$suplente} ({$rango}) - {$this->estado}";
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SolicitudAula extends Model
{
    use HasFactory;

    protected $table = 'solicitud_aula';
    protected $primaryKey = 'id_solicitud';
    public $timestamps = false;
    protected $fillable = [
        'id_asignacion',
        'nro_aula',
        'fecha_solicitada',
        'motivo',
        'estado',
        'fecha_solicitud',
        'observaciones',
    ];

    protected $casts = [
        'fecha_solicitada' => 'date',
        'fecha_solicitud' => 'datetime',
    ];

    // ==============================
    //  RELACIONES
    // ==============================

    // Relación con la asignación
    public function asignacion()
    {
        return $this->belongsTo(Asignacion::class, 'id_asignacion', 'id_asignacion');
    }

    // Relación con el aula
    public function aula()
    {
        return $this->belongsTo(Aula::class, 'nro_aula', 'nro_aula');
    }

    // ==============================
    //  SCOPES ÚTILES
    // ==============================

    // Filtrar por estado
    public function scopePendientes($query)
    {
        return $query->where('estado', 'Pendiente');
    }

    public function scopeAprobadas($query)
    {
        return $query->where('estado', 'Aprobada');
    }

    public function scopeRechazadas($query)
    {
        return $query->where('estado', 'Rechazada');
    }

    // Filtrar por una fecha específica
    public function scopeEnFecha($query, $fecha)
    {
        return $query->whereDate('fecha_solicitada', $fecha);
    }

    // Filtrar solicitudes de un aula
    public function scopeDeAula($query, $nroAula)
    {
        return $query->where('nro_aula', $nroAula);
    }

    // ==============================
    //  HELPERS
    // ==============================

    // Determina si está pendiente de revisión
    public function getEstaPendienteAttribute()
    {
        return $this->estado === 'Pendiente';
    }

    // Formato legible de fecha
    public function getFechaFormateadaAttribute()
    {
        return $this->fecha_solicitada?->format('d/m/Y');
    }

    // Color según estado (para dashboards o etiquetas)
    public function getColorEstadoAttribute()
    {
        return match ($this->estado) {
            'Pendiente' => 'warning',
            'Aprobada' => 'success',
            'Rechazada' => 'danger',
            default => 'secondary'
        };
    }
}

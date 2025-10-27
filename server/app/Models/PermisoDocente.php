<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class PermisoDocente extends Model
{
    use HasFactory;
    
    protected $table = 'permiso_docente';
    protected $primaryKey = 'id_permiso';

    protected $fillable = [
        'codigo_docente',
        'documento_evidencia',
        'fecha_inicio',
        'fecha_fin',
        'motivo',
        'estado', // 'Pendiente' , 'Aprobado', 'Rechazado'
        'fecha_solicitud',
        'fecha_revision',
        'observaciones',
    ];

    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
        'fecha_solicitud' => 'date',
        'fecha_revision' => 'date',
    ];

    // RELACIONES

    public function docente ()
    {
        return $this->belongsTo(Docente::class, 'codigo_docente');
    }

    // ==============================
    //  SCOPES ÚTILES
    // ==============================

    // Permisos en estado pendiente
    public function scopePendientes($query)
    {
        return $query->where('estado', 'Pendiente');
    }

    // Permisos aprobados
    public function scopeAprobados($query)
    {
        return $query->where('estado', 'Aprobado');
    }

    // Permisos rechazados
    public function scopeRechazados($query)
    {
        return $query->where('estado', 'Rechazado');
    }

    // Permisos dentro de un rango de fechas
    public function scopeEntreFechas($query, $inicio, $fin)
    {
        return $query->whereBetween('fecha_inicio', [$inicio, $fin]);
    }

    // ==============================
    //  HELPERS
    // ==============================

    // Verifica si el permiso está vigente (hoy dentro del rango)
    public function getEstaVigenteAttribute()
    {
        $hoy = now()->toDateString();
        return $this->fecha_inicio <= $hoy && $this->fecha_fin >= $hoy;
    }

    // Devuelve color según estado (para dashboard)
    public function getColorEstadoAttribute()
    {
        return match ($this->estado) {
            'Pendiente' => 'warning',
            'Aprobado' => 'success',
            'Rechazado' => 'danger',
            default => 'secondary'
        };
    }

    // Formato legible del rango de fechas
    public function getRangoFechasAttribute()
    {
        return $this->fecha_inicio->format('d/m/Y') . ' - ' . $this->fecha_fin->format('d/m/Y');
    }
}

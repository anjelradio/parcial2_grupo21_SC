<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class AsistenciaDocente extends Model
{
    use HasFactory;

    protected $table = 'asistencia_docente';
    protected $primaryKey = 'id_asistencia';
    public $timestamps = false;
    protected $fillable = [
        'id_asignacion',
        'id_tipo_asistencia',
        'fecha',
        'hora_registro',
        'estado',
        'marcado_por',
    ];

    protected $casts = [
        'fecha' => 'date',
        'hora_registro' => 'datetime',
    ];

    // RELACIONES
    public function asignacion()
    {
        return $this->belongsTo(Asignacion::class, 'id_asignacion');
    }

    public function tipoAsistencia()
    {
        return $this->belongsTo(TipoAsistencia::class, 'id_tipo_asistencia');
    }

    public function evidencia()
    {
        return $this->hasOne(EvidenciaAsistencia::class, 'id_asistencia');
    }

    // SCOPES
    public function scopePresente($query)
    {
        return $query->where('estado', 'Presente');
    }

    public function scopeAusente($query)
    {
        return $query->where('estado', 'Ausente');
    }

    public function scopeEnFecha($query, $fecha)
    {
        return $query->whereDate('fecha', $fecha);
    }
}

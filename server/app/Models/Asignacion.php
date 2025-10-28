<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asignacion extends Model
{
    use HasFactory;

    protected $table = 'asignacion';
    protected $primaryKey = 'id_asignacion';
    public $timestamps = false;
    protected $fillable = [
        'codigo_docente',
        'id_grupo',
        'id_gestion',
        'estado',
        'observaciones',
    ];

    // RELACIONES

    public function docente()
    {
        return $this->belongsTo(Docente::class, 'codigo_docente', 'codigo_docente');
    }

    public function grupo()
    {
        return $this->belongsTo(Grupo::class, 'id_grupo', 'id_grupo');
    }

    public function gestion()
    {
        return $this->belongsTo(GestionAcademica::class, 'id_gestion', 'id_gestion');
    }

    public function detallesHorario()
    {
        return $this->hasMany(DetalleHorario::class, 'id_asignacion', 'id_asignacion');
    }

    public function asistencias()
    {
        return $this->hasMany(AsistenciaDocente::class, 'id_asignacion', 'id_asignacion');
    }

    public function suplencia()
    {
        return $this->hasOne(Suplencia::class, 'id_asignacion', 'id_asignacion');
    }

    public function solicitudesAula()
    {
        return $this->hasMany(SolicitudAula::class, 'id_asignacion', 'id_asignacion');
    }

    // SCOPES

    public function scopeVigentes($query)
    {
        return $query->where('estado', 'Vigente');
    }

    public function scopeFinalizadas($query)
    {
        return $query->where('estado', 'Finalizada');
    }

    public function scopeCanceladas($query)
    {
        return $query->where('estado', 'Cancelada');
    }

    // HELPERS

    public function esVigente() { return $this->estado === 'Vigente'; }
    public function esFinalizada() { return $this->estado === 'Finalizada'; }
    public function esCancelada() { return $this->estado === 'Cancelada'; }

    public function descripcion()
    {
        $docente = $this->docente?->user?->nombre_completo ?? 'Desconocido';
        $grupo = $this->grupo?->nombre ?? 'N/A';
        $materia = $this->grupo?->materia?->sigla ?? '';
        return "{$materia} - Grupo {$grupo} ({$docente})";
    }
}

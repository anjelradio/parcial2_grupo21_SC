<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Grupo extends Model
{
    use HasFactory;

    protected $table = 'grupo';
    protected $primaryKey = 'id_grupo';

    protected $fillable = [
        'nombre',
        'id_materia',
    ];

    // RELACIONES

    public function materia()
    {
        return $this->belongsTo(Materia::class, 'id_materia', 'id_materia');
    }

    public function asignaciones()
    {
        return $this->hasMany(Asignacion::class, 'id_grupo', 'id_grupo');
    }

    // ==============================
    //  SCOPES ÚTILES
    // ==============================

    // Filtrar por nombre de grupo
    public function scopeNombre($query, $nombre)
    {
        return $query->where('nombre', $nombre);
    }

    // Filtrar por materia específica
    public function scopeDeMateria($query, $idMateria)
    {
        return $query->where('id_materia', $idMateria);
    }

    // ==============================
    //  HELPERS
    // ==============================

    // Devuelve el nombre completo con la materia
    public function getNombreCompletoAttribute()
    {
        $materia = $this->materia ? $this->materia->sigla : '—';
        return "{$materia} - Grupo {$this->nombre}";
    }

}

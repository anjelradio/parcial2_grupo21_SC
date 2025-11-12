<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoAsistencia extends Model
{
    use HasFactory;

    protected $table = 'tipo_asistencia';
    protected $primaryKey = 'id_tipo';
    public $timestamps = false;
    protected $fillable = [
        'nombre', // ('Presencial', 'Virtual')
    ];

    // RELACIONES
    public function asistencias()
    {
        return $this->hasMany(AsistenciaDocente::class, 'id_tipo_asistencia', 'id_tipo');
    }

    // HELPERS
    public function esPresencial()
    {
        return $this->nombre === 'Presencial';
    }

    public function esVirtual()
    {
        return $this->nombre === 'Virtual';
    }
    

    // SCOPES

    public function scopePresencial($query)
    {
        return $query->where('nombre', 'Presencial');
    }

    public function scopeVirtual($query)
    {
        return $query->where('nombre', 'Virtual');
    }
    
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Docente extends Model
{
    use HasFactory;

    protected $table = 'docente';
    protected $primaryKey = 'codigo_docente';
    public $incrementing = false;
    protected $keyType = 'string';

    public $timestamps = false;
    
    protected $fillable = [
        'codigo_docente',
        'user_id',
        'profesion',
    ];

    // Relaciones
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function asignaciones()
    {
        return $this->hasMany(Asignacion::class, 'codigo_docente', 'codigo_docente');
    }

    public function permisos()
    {
        return $this->hasMany(PermisoDocente::class, 'codigo_docente', 'codigo_docente');
    }

    public function suplenciasTitular()
    {
        return $this->hasMany(Suplencia::class, 'cod_titular', 'codigo_docente');
    }

    public function suplenciasSuplente()
    {
        return $this->hasMany(Suplencia::class, 'cod_suplente', 'codigo_docente');
    }
}

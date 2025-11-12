<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QrGestion extends Model
{
    use HasFactory;

    // Nombre de la tabla
    protected $table = 'qr_gestion';

    // Clave primaria
    protected $primaryKey = 'id_qr';
    public $timestamps = false;
    // Campos que se pueden asignar masivamente
    protected $fillable = [
        'id_gestion',
        'token',
        'imagen_url',
        'activo',
        'fecha_creacion',
        'fecha_actualizacion',
    ];

    // Casts automáticos
    protected $casts = [
        'activo' => 'boolean',
        'fecha_creacion' => 'datetime',
        'fecha_actualizacion' => 'datetime',
    ];

    // RELACIONES ============================
    public function gestion()
    {
        return $this->belongsTo(GestionAcademica::class, 'id_gestion');
    }

    // SCOPES ================================
    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }

    public function scopePorGestion($query, $idGestion)
    {
        return $query->where('id_gestion', $idGestion);
    }
}

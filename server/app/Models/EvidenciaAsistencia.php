<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EvidenciaAsistencia extends Model
{
    use HasFactory;

    protected $table = 'evidencia_asistencia';
    protected $primaryKey = 'id_evidencia';
    public $timestamps = false;
    
    protected $fillable = [
        'id_asistencia',
        'imagen',
        'confianza',
        'fecha_subida',
        'motivo', // Cambiado de 'observaciones' a 'motivo'
    ];

    protected $casts = [
        'confianza' => 'float',
        'fecha_subida' => 'datetime',
    ];

    // RELACIONES
    public function asistencia()
    {
        return $this->belongsTo(AsistenciaDocente::class, 'id_asistencia', 'id_asistencia');
    }

    // HELPERS
    public function nivelConfianza()
    {
        return "{$this->confianza}%";
    }

    public function esAltaConfianza()
    {
        return $this->confianza >= 90;
    }

    public function rutaImagen()
    {
        return $this->imagen; // Ya devuelve la URL completa de Cloudinary
    }
}
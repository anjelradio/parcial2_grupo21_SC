<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dia extends Model
{
    use HasFactory;

    protected $table = 'dia';
    protected $primaryKey = 'id_dia';
    public $timestamps = false;
    protected $fillable = [
        'nombre',
    ];

    // RELACIONES
    public function detalles()
    {
        return $this->hasMany(DetalleHorario::class, 'id_dia', 'id_dia');
    }

    // Helper útil: capitalizar nombre
    public function getNombreAttribute($value)
    {
        return ucfirst(strtolower($value)); // Ej: "lunes" → "Lunes"
    }
}

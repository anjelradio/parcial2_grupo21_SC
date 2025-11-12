<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UbicacionFacultad extends Model
{
    use HasFactory;

    protected $table = 'ubicacion_facultad';
    protected $primaryKey = 'id_ubicacion';
    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'latitud',
        'longitud',
        'radio_permitido',
    ];

    protected $casts = [
        'latitud' => 'float',
        'longitud' => 'float',
        'radio_permitido' => 'integer',
    ];

    // HELPERS
    // Devuelve coordenadas en string
    public function coordenadas()
    {
        if ($this->latitud && $this->longitud) {
            return "{$this->latitud}, {$this->longitud}";
        }
        return 'Sin coordenadas registradas';
    }

    // Devuelve descripción del radio
    public function radioDescripcion()
    {
        return "{$this->radio_permitido} metros";
    }


    // SCOPES
    // Scope para buscar ubicaciones por nombre
    public function scopePorNombre($query, $nombre)
    {
        return $query->where('nombre', 'ILIKE', "%{$nombre}%");
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class BloqueHorario extends Model
{
    use HasFactory;

    protected $table = 'bloque_horario';
    protected $primaryKey = 'id_bloque';

    protected $fillable = [
        'hora_inicio',
        'hora_fin',
    ];

    protected $casts = [
        'hora_inicio' => 'datetime:H:i',
        'hora_fin' => 'datetime:H:i',
    ];

    // RELACIONES
    public function detallesHorario()
    {
        return $this->hasMany(DetalleHorario::class, 'id_bloque', 'id_bloque');
    }

    // Helper opcional
    public function rango()
    {
        return "{$this->hora_inicio->format('H:i')} - {$this->hora_fin->format('H:i')}";
    }

}

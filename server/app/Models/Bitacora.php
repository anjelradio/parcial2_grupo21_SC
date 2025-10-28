<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Bitacora extends Model
{
    use HasFactory;

    protected $table = 'bitacora';
    protected $primaryKey = 'id_bitacora';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'accion',
        'fecha_hora',
        'ip',
    ];

    protected $casts = [
        'fecha_hora' => 'datetime',
    ];

    //RELACIONES
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    // SCOPES
    public function scopePorUsuario($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeRecientes($query)
    {
        return $query->orderByDesc('fecha_hora');
    }

    public function scopeAccionContiene($query, $texto)
    {
        return $query->where('accion', 'ILIKE', "%{$texto}%");
    }


    // HELPERS

     // Devuelve la acción con un formato más legible
    public function getDescripcionAttribute()
    {
        return ucfirst($this->accion);
    }

    // Devuelve la fecha formateada bonita
    public function getFechaFormateadaAttribute()
    {
        return $this->fecha_hora?->format('d/m/Y H:i');
    }
}



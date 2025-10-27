<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;


class ImportacionUsuarios extends Model
{
    use HasFactory;

    protected $table = 'importacion_usuarios';
    protected $primaryKey = 'id_importacion';

    protected $fillable = [
        'archivo_nombre',
        'fecha_importacion',
        'total_registros',
        'user_id',
        'id_gestion',
    ];

    protected $casts = [
        'fecha_importacion' => 'datetime',
    ];

    // RELACIONES
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function gestion()
    {
        return $this->belongsTo(GestionAcademica::class, 'id_gestion', 'id_gestion');
    }
}

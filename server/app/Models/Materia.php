<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Materia extends Model
{
    use HasFactory;
    
    protected $table = 'materia';
    protected $primaryKey = 'id_materia';
    public $timestamps = false;
    protected $fillable = ['sigla', 'nombre'];

    public function grupos()
    {
        return $this->hasMany(Grupo::class, 'id_materia');
    }
    
}

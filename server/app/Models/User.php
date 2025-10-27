<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    protected $table = 'users';
    protected $primaryKey = 'id';

    protected $fillable = [
        'nombre',
        'apellido_paterno',
        'apellido_materno',
        'email',
        'password',
        'rol',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // RELACIONES
    public function docente()
    {
        return $this->hasOne(Docente::class, 'user_id');
    }

    public function bitacoras()
    {
        return $this->hasMany(Bitacora::class, 'user_id', 'id');
    }

    public function importaciones()
    {
        return $this->hasMany(ImportacionUsuarios::class, 'user_id', 'id');
    }

    // HELPERS PARA ROLES

    public function isDocente()
    {
        return $this->rol === 'DOCENTE';
    }

    public function isAdmin()
    {
        return $this->rol === 'ADMIN';
    }

    public function isAutoridad()
    {
        return $this->rol === 'AUTORIDAD';
    }

    public function hasRole(...$roles)
    {
        return in_array($this->rol, $roles);
    }

    // ACCESSOR: Nombre completo
    public function getNombreCompletoAttribute()
    {
        return "{$this->nombre} {$this->apellido_paterno} {$this->apellido_materno}";
    }
}

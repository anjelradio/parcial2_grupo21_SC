<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class DocentesExport implements FromCollection, WithHeadings
{
    protected $docentes;

    public function __construct($docentes)
    {
        $this->docentes = $docentes;
    }

    public function collection()
    {
        return collect($this->docentes);
    }

    public function headings(): array
    {
        return [
            'Código Docente',
            'Usuario ID',
            'Nombre Completo',
            'Correo Electrónico',
            'Profesión'
        ];
    }
}

<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Illuminate\Support\Collection;

class GruposMateriasExport implements FromCollection, WithHeadings
{
    protected $grupos;

    public function __construct(array $grupos)
    {
        $this->grupos = $grupos;
    }

    public function collection()
    {
        return new Collection($this->grupos);
    }

    public function headings(): array
    {
        return [
            'ID Grupo',
            'Nombre Grupo',
            'Sigla Materia',
            'Nombre Materia',
        ];
    }
}

<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class AsignacionesExport implements FromArray, WithHeadings, WithStyles
{
    protected $asignaciones;

    public function __construct(array $asignaciones)
    {
        $this->asignaciones = $asignaciones;
    }

    public function array(): array
    {
        $rows = [];

        foreach ($this->asignaciones as $asignacion) {
            $base = [
                'Grupo' => $asignacion['grupo'],
                'Sigla' => $asignacion['sigla'],
                'Materia' => $asignacion['materia'],
                'Docente' => $asignacion['docente'],
            ];

            $i = 1;
            foreach ($asignacion['horarios'] as $horario) {
                $base["Horario {$i}"] = $horario['horario'];
                $base["Aula {$i}"] = $horario['aula'];
                $i++;
            }

            $rows[] = $base;
        }

        return $rows;
    }

    public function headings(): array
    {
        return [
            'Grupo',
            'Sigla',
            'Materia',
            'Docente',
            'Horario 1', 'Aula 1',
            'Horario 2', 'Aula 2',
            'Horario 3', 'Aula 3',
            'Horario 4', 'Aula 4',
            'Horario 5', 'Aula 5',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}

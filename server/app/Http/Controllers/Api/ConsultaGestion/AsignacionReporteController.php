<?php

namespace App\Http\Controllers\Api\ConsultaGestion;

use App\Http\Controllers\Controller;
use App\Services\ConsultaGestion\AsignacionService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Exports\AsignacionesExport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\GestionAcademica;

class AsignacionReporteController extends Controller
{
    use ApiResponse;

    protected $service;

    public function __construct(AsignacionService $service)
    {
        $this->service = $service;
    }

    public function generarReporte(Request $request, $id_gestion)
    {
        try {
            $filtros = [
                'nombre_docente' => $request->query('nombre_docente'),
                'nombre_materia' => $request->query('nombre_materia'),
            ];

            $asignaciones = $this->service->getAsignacionesConHorarios($id_gestion, $filtros);

            if (empty($asignaciones)) {
                return $this->error('No existen asignaciones para esta gestión.');
            }

            return Excel::download(
                new AsignacionesExport($asignaciones),
                "reporte_asignaciones_gestion_{$id_gestion}.xlsx"
            );
        } catch (\Exception $e) {
            return $this->error('Error al generar el reporte: ' . $e->getMessage(), 500);
        }
    }


    public function generarReportePDF(Request $request, $id_gestion)
    {
        try {
            $filtros = [
                'nombre_docente' => $request->query('nombre_docente'),
                'nombre_materia' => $request->query('nombre_materia'),
            ];

            $gestion = GestionAcademica::findOrFail($id_gestion);

            // Obtener descripción legible, ejemplo: "2025 - 1° Semestre"
            $gestionDescripcion = $gestion->descripcion();
            $gestionNombreArchivo = str_replace([' ', '°', '/'], ['-', '', '-'], $gestionDescripcion);

            $asignaciones = $this->service->getAsignacionesConHorarios($id_gestion, $filtros);

            // Filtrar solo las asignaciones que tienen horarios
            $asignacionesConHorario = array_filter($asignaciones, fn($a) => count($a['horarios']) > 0);

            if (empty($asignacionesConHorario)) {
                return $this->error('No existen asignaciones con horario para esta gestión.');
            }

            $fecha = now()->format('d/m/Y');

            $pdf = Pdf::loadView('reportes.asignaciones', [
                'asignaciones' => $asignacionesConHorario,
                'gestion' => $gestionDescripcion,
                'fecha' => $fecha
            ])->setPaper('A4', 'landscape');

            // nombre del archivo amigable
            $nombreArchivo = "reporte_asignaciones_gestion_{$gestionNombreArchivo}.pdf";

            return $pdf->download($nombreArchivo);
        } catch (\Exception $e) {
            return $this->error('Error al generar el reporte PDF: ' . $e->getMessage(), 500);
        }
    }
}

<?php

namespace App\Http\Controllers\Api\ConsultaGestion;

use App\Http\Controllers\Controller;
use App\Services\ConsultaGestion\DocenteService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Models\GestionAcademica;
use App\Exports\DocentesExport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;


class DocenteController extends Controller
{
    use ApiResponse;

    protected $service;

    public function __construct(DocenteService $service)
    {
        $this->service = $service;
    }

    /**
     * GET /api/consulta-gestion/{id_gestion}/docentes
     * 
     * Parámetros query:
     * - page (default: 1)
     * - page_size (default: 20)
     * - nombre_docente (opcional, para búsqueda)
     */
    public function index(Request $request, $id_gestion)
    {
        try {
            $filters = [
                'page' => $request->query('page', 1),
                'page_size' => $request->query('page_size', 20),
                'nombre_docente' => $request->query('nombre_docente')
            ];

            $data = $this->service->getDocentesActivos($id_gestion, $filters);

            return $this->success($data, 'Docentes activos obtenidos correctamente.');
        } catch (\Exception $e) {
            return $this->error('Error al obtener docentes activos.', 500, $e->getMessage());
        }
    }

     public function generarReporte(Request $request, $id_gestion)
    {
        try {
            $tipo = $request->query('tipo', 'pdf');
            $filtros = ['nombre_docente' => $request->query('nombre_docente')];

            $gestion = GestionAcademica::findOrFail($id_gestion);
            $gestionDescripcion = $gestion->descripcion();
            $gestionNombreArchivo = str_replace([' ', '°', '/'], ['-', '', '-'], $gestionDescripcion);

            $docentes = $this->service->getAllDocentesActivos($id_gestion, $filtros);

            if (empty($docentes)) {
                return $this->error('No hay docentes activos para esta gestión.');
            }

            if ($tipo === 'excel') {
                return Excel::download(
                    new DocentesExport($docentes),
                    "reporte_docentes_gestion_{$gestionNombreArchivo}.xlsx"
                );
            }

            $fecha = now()->format('d/m/Y');
            $pdf = Pdf::loadView('reportes.docentes', [
                'docentes' => $docentes,
                'gestion' => $gestionDescripcion,
                'fecha' => $fecha
            ])->setPaper('A4', 'portrait');

            return $pdf->download("reporte_docentes_gestion_{$gestionNombreArchivo}.pdf");
        } catch (\Exception $e) {
            return $this->error('Error al generar el reporte.', 500, $e->getMessage());
        }
    }
}

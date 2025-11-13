<?php

namespace App\Http\Controllers\API\ConsultaGestion;

use App\Http\Controllers\Controller;
use App\Services\ConsultaGestion\GrupoMateriaService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Models\GestionAcademica;
use App\Exports\GruposMateriasExport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;


class GrupoMateriaController extends Controller
{
    use ApiResponse;

    protected $service;

    public function __construct(GrupoMateriaService $service)
    {
        $this->service = $service;
    }

    /**
     * GET /api/consulta-gestion/{id_gestion}/grupos
     * 
     * Parámetros query:
     * - page (default: 1)
     * - page_size (default: 20)
     * - search (opcional, busca por materia o grupo)
     */
    public function index(Request $request, $id_gestion)
    {
        try {
            $filters = [
                'page' => $request->query('page', 1),
                'page_size' => $request->query('page_size', 20),
                'search' => $request->query('search')
            ];

            $data = $this->service->getGruposActivos($id_gestion, $filters);

            return $this->success($data, 'Grupos y materias activos obtenidos correctamente.');
        } catch (\Exception $e) {
            return $this->error('Error al obtener grupos activos.', 500, $e->getMessage());
        }
    }

    public function generarReporte(Request $request, $id_gestion)
    {
        try {
            $tipo = $request->query('tipo', 'pdf');
            $filtros = [
                'materia' => $request->query('materia'),
                'grupo' => $request->query('grupo')
            ];

            $gestion = GestionAcademica::findOrFail($id_gestion);
            $gestionDescripcion = $gestion->descripcion();
            $gestionNombreArchivo = str_replace([' ', '°', '/'], ['-', '', '-'], $gestionDescripcion);

            $grupos = $this->service->getAllGruposActivos($id_gestion, $filtros);


            if (empty($grupos)) {
                return $this->error('No hay grupos ni materias activas para esta gestión.');
            }

            if ($tipo === 'excel') {
                return Excel::download(
                    new GruposMateriasExport($grupos),
                    "reporte_grupos_gestion_{$gestionNombreArchivo}.xlsx"
                );
            }

            $fecha = now()->format('d/m/Y');
            $pdf = Pdf::loadView('reportes.grupos_materias', [
                'grupos' => $grupos,
                'gestion' => $gestionDescripcion,
                'fecha' => $fecha
            ])->setPaper('A4', 'landscape');

            return $pdf->download("reporte_grupos_gestion_{$gestionNombreArchivo}.pdf");
        } catch (\Exception $e) {
            return $this->error('Error al generar el reporte.', 500, $e->getMessage());
        }
    }
}

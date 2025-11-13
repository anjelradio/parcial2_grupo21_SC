import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../../components/ui/dialog";
import {
  Calendar,
  CheckCircle,
  ClipboardList,
  Clock,
  FileSpreadsheet,
  XCircle,
} from "lucide-react";
import { useAppStore } from "../../../../../stores/useAppStore";

function AsistenciasModal() {
  const { setModal, modals, supervisionAsignacionData } = useAppStore();
  const [filtroMesAsistencias, setFiltroMesAsistencias] = useState("");
  
  return (
    <Dialog
      open={modals.asistenciasModal}
      onOpenChange={(open) => setModal("asistenciasModal", open)}
    >
      <DialogContent
        className="max-w-4xl max-h-[90vh] flex flex-col p-0"
        style={{ borderRadius: "12px" }}
      >
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-gray-900 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-[#226c8f]" />
            Historial de Asistencias
          </DialogTitle>
          <DialogDescription>
            Registro completo de asistencias de la asignación
          </DialogDescription>
        </DialogHeader>

        {supervisionAsignacionData && (
          <div className="flex-1 overflow-y-auto px-6">
            <div className="space-y-6 pb-4">
              {/* Información de la asignación */}
              <div
                className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 border-l-4 border-[#226c8f]"
                style={{ borderRadius: "8px" }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-600">Docente</p>
                    <p className="text-gray-900">
                      {supervisionAsignacionData?.info_asignacion.docente}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Materia</p>
                    <p className="text-gray-900">
                      {supervisionAsignacionData?.info_asignacion.materia}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Grupo</p>
                    <p className="text-gray-900">
                      {supervisionAsignacionData.info_asignacion.grupo}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Semestre</p>
                    <p className="text-gray-900">
                      {supervisionAsignacionData?.info_asignacion.gestion}
                    </p>
                  </div>
                </div>
              </div>

              {/* Estadísticas Resumidas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div
                  className="bg-blue-50 p-4 text-center"
                  style={{ borderRadius: "8px" }}
                >
                  <ClipboardList className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl text-blue-600">
                    {supervisionAsignacionData.estadisticas.total_asistencias}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Total Asistencias
                  </p>
                </div>
                <div
                  className="bg-green-50 p-4 text-center"
                  style={{ borderRadius: "8px" }}
                >
                  <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl text-green-600">
                    {supervisionAsignacionData.estadisticas.total_presentes}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Marcadas</p>
                </div>
                <div
                  className="bg-red-50 p-4 text-center"
                  style={{ borderRadius: "8px" }}
                >
                  <XCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl text-red-600">
                    {supervisionAsignacionData.estadisticas.total_ausentes}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Ausentes</p>
                </div>
                <div
                  className="bg-yellow-50 p-4 text-center"
                  style={{ borderRadius: "8px" }}
                >
                  <Clock className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                  <p className="text-2xl text-yellow-600">
                    {supervisionAsignacionData.estadisticas.total_retrasos}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Retrasos</p>
                </div>
              </div>

              {/* Filtro por mes */}
              <div
                className="bg-white p-4 border border-gray-200"
                style={{ borderRadius: "8px" }}
              >
                <label className="block text-sm text-gray-700 mb-2">
                  Filtrar por mes
                </label>
                <select
                  value={filtroMesAsistencias}
                  // onChange={(e) => setFiltroMesAsistencias(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#226c8f]"
                  style={{ borderRadius: "6px" }}
                >
                  <option value="">Todos los meses</option>
                  <option value="01">Enero</option>
                  <option value="02">Febrero</option>
                  <option value="03">Marzo</option>
                  <option value="04">Abril</option>
                  <option value="05">Mayo</option>
                  <option value="06">Junio</option>
                  <option value="07">Julio</option>
                  <option value="08">Agosto</option>
                  <option value="09">Septiembre</option>
                  <option value="10">Octubre</option>
                  <option value="11">Noviembre</option>
                  <option value="12">Diciembre</option>
                </select>
              </div>

              {/* Listado de Asistencias */}
              <div className="bg-gray-50 p-4" style={{ borderRadius: "8px" }}>
                <h4 className="text-sm text-gray-700 mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#226c8f]" />
                  Registro de Asistencias
                </h4>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {supervisionAsignacionData.asistencias.map((asistencia) => (
                    <div
                      key={asistencia.fecha}
                      className="bg-white p-3 border border-gray-200 hover:shadow-md transition-shadow"
                      style={{ borderRadius: "6px" }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`px-3 py-1 text-xs ${
                              asistencia.tipo_asistencia === "Presencial"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-purple-100 text-purple-700"
                            }`}
                            style={{ borderRadius: "6px" }}
                          >
                            {asistencia.tipo_asistencia}
                          </div>
                          <div>
                            <p className="text-sm text-gray-900">
                              {asistencia.fecha}
                            </p>
                            <p className="text-xs text-gray-600">
                              Hora: {asistencia.hora_registro}
                            </p>
                          </div>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between items-center px-6 py-4 border-t border-gray-100">
          <button
            onClick={() => {
              if (supervisionAsignacionData) {
                alert(
                  `Generando reporte de asistencias para ${supervisionAsignacionData.info_asignacion.docente} - ${supervisionAsignacionData.info_asignacion.materia}`
                );
              }
            }}
            className="px-3 py-1.5 bg-[#226c8f] text-white hover:bg-[#2c415a] transition-colors text-xs flex items-center gap-2"
            style={{ borderRadius: "6px" }}
          >
            <FileSpreadsheet className="w-3 h-3" />
            Generar reporte
          </button>
          <button
            onClick={() => setModal("asistenciasModal", false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors text-sm"
            style={{ borderRadius: "6px" }}
          >
            Cerrar
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AsistenciasModal;

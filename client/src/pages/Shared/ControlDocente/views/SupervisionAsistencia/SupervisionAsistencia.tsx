import { ArrowLeft, Calendar, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AsignacionesManageList from "./AsignacionesManageList";
import AsistenciasModal from "./AsistenciasModal";
import { useAppStore } from "../../../../../stores/useAppStore";

function SupervisionAsistencia() {
  const {
    supervisionGlobalData,
    supervisionGlobalLoading,
    fetchSupervisionGlobal,
  } = useAppStore();
  const [semestreFilter, setSemestreFilter] = useState("todos");
  useEffect(() => {
    fetchSupervisionGlobal(); // carga la gestión vigente automáticamente
  }, []);

  const estad = supervisionGlobalData?.estadisticas;

  const cumplimiento = estad?.tasa_cumplimiento_global ?? 0;
  const marcadas = estad?.total_asistencias_marcadas ?? 0;
  const ausentes = estad?.total_ausentes ?? 0;
  const retrasos = estad?.total_retrasos ?? 0;

  const resumen = estad?.resumen_general;
  const totalAsignaciones = resumen?.total_asignaciones ?? 0;
  const totalDocentes = resumen?.total_docentes ?? 0;

  const presencial =
    resumen?.distribucion_asistencias?.presencial?.porcentaje ?? 0;
  const virtual = resumen?.distribucion_asistencias?.virtual?.porcentaje ?? 0;
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      {/* Header con botón de regreso */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-600 hover:text-[#226c8f] hover:bg-gray-100 transition-colors"
          style={{ borderRadius: "8px" }}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-gray-900">Supervisión de Asistencias</h1>
          <p className="text-gray-600">
            Control y seguimiento de asistencias docentes
          </p>
        </div>
      </div>

      {/* Estadísticas Globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Estadística 1: Tasa de Cumplimiento */}
        <div
          className="bg-white p-6 shadow-lg border border-gray-100"
          style={{ borderRadius: "8px" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-1 h-6 bg-[#226c8f]"
              style={{ borderRadius: "2px" }}
            ></div>
            <h3 className="text-gray-900">Tasa de Cumplimiento Global</h3>
          </div>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#226c8f"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(cumplimiento / 100) * 440} 440`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl text-[#226c8f]">{2}%</p>
                  <p className="text-xs text-gray-500 mt-1">Cumplimiento</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-green-50 p-3" style={{ borderRadius: "6px" }}>
              <p className="text-xs text-gray-600 mt-1">Marcadas: {marcadas}</p>
              <p className="text-xs text-gray-600 mt-1">Marcadas</p>
            </div>
            <div className="bg-red-50 p-3" style={{ borderRadius: "6px" }}>
              <p className="text-xs text-gray-600 mt-1">Ausentes: {ausentes}</p>
              <p className="text-xs text-gray-600 mt-1">Ausentes</p>
            </div>
            <div className="bg-yellow-50 p-3" style={{ borderRadius: "6px" }}>
              <p className="text-xs text-gray-600 mt-1">Retrasos: {retrasos}</p>
              <p className="text-xs text-gray-600 mt-1">Retrasos</p>
            </div>
          </div>
        </div>

        {/* Estadística 2: Resumen General */}
        <div
          className="bg-white p-6 shadow-lg border border-gray-100"
          style={{ borderRadius: "8px" }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div
              className="w-1 h-6 bg-[#226c8f]"
              style={{ borderRadius: "2px" }}
            ></div>
            <h3 className="text-gray-900">Resumen General</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div
              className="bg-blue-50 p-4 text-center"
              style={{ borderRadius: "8px" }}
            >
              <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mt-1">{totalAsignaciones}</p>
              <p className="text-sm text-gray-600 mt-1">Asignaciones</p>
            </div>
            <div
              className="bg-purple-50 p-4 text-center"
              style={{ borderRadius: "8px" }}
            >
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mt-1">{totalDocentes}</p>

              <p className="text-sm text-gray-600 mt-1">Docentes</p>
            </div>
          </div>

          {/* Tipos de Asistencia */}
          <div className="space-y-3">
            <p className="text-sm text-gray-700">Distribución de Asistencias</p>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#226c8f]">{presencial}%</span>
                <div
                  className="bg-[#226c8f] h-full"
                  style={{ width: `${presencial}%` }}
                ></div>
              </div>
              <div
                className="w-full bg-gray-200 h-3"
                style={{ borderRadius: "6px", overflow: "hidden" }}
              >
                <div
                  className="bg-[#226c8f] h-full"
                  style={{ width: "65%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-purple-600">{virtual}%</span>
                <div
                  className="bg-purple-500 h-full"
                  style={{ width: `${virtual}%` }}
                ></div>
              </div>
              <div
                className="w-full bg-gray-200 h-3"
                style={{ borderRadius: "6px", overflow: "hidden" }}
              >
                <div
                  className="bg-purple-500 h-full"
                  style={{ width: "35%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Listado de Asignaciones */}
      <AsignacionesManageList />
      <AsistenciasModal />
    </div>
  );
}

export default SupervisionAsistencia;

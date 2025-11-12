import {
  Video,
  QrCode,
  BookOpen,
  FileText,
  Users,
  CheckSquare,
  School,
  Building2,
} from "lucide-react";
import { Pie, ResponsiveContainer, PieChart, Cell, Tooltip } from "recharts";
import { ScrollArea } from "../../../components/ui/scroll-area";
import AsistenciaVirutal from "./Modals/AsistenciaVirtualModal";
import { useAppStore } from "../../../stores/useAppStore";
import AsistenciaVirtualModal from "./Modals/AsistenciaVirtualModal";
import { useNavigate } from "react-router-dom";

function AsistenciasDocente() {
  const { setModal } = useAppStore();
  const navigate = useNavigate()
  // Datos de distribución para gráfica de pastel
  const distribucionMes = [
    { name: "Presencial", value: 74, color: "#2c415a" },
    { name: "Virtual", value: 26, color: "#226c8f" },
  ];
  // Función para obtener icono de aula
  const getAulaIcon = (tipo: string) => {
    return tipo === "lab" ? School : Building2;
  };

  const handleAsistenciaVirtual = () => {
    setModal("asistenciaVirtualModal", true);
  };

  const handleAsistenciaPresencial = () => {
    navigate("/docente/reg-asistencia");
  };
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Registro de Asistencias</h1>
        <p className="text-gray-600">Gestiona todas tus asistencias</p>
      </div>

      {/* Layout Desktop: 2 columnas / Mobile: botones arriba, estadísticas abajo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Columna izquierda: botones */}
        <div className="grid grid-cols-2 gap-6 h-full">
          {/* Botón Asistencia Presencial */}
          <button
          onClick={handleAsistenciaPresencial}
            className="bg-[#226c8f] flex flex-col justify-center items-center p-6 md:p-8 shadow-lg border border-[#226c8f] transition-all duration-300 hover:shadow-xl hover:scale-105 group w-full h-full cursor-pointer"
            style={{ borderRadius: "12px" }}
          >
            <div className="flex flex-col items-center gap-3 md:gap-4">
              <div className="p-3 md:p-4 bg-white/20 group-hover:bg-white/30 transition-all rounded-lg">
                <QrCode className="w-8 h-8 md:w-12 md:h-12 text-white" />
              </div>
              <div className="text-center">
                <h3 className="text-white text-base md:text-xl font-medium mb-1">
                  Asistencia Presencial
                </h3>
                <p className="text-white/80 text-xs md:text-sm">
                  Registrar clase presencial
                </p>
              </div>
            </div>
          </button>

          {/* Botón Asistencia Virtual */}
          <button
            onClick={handleAsistenciaVirtual}
            className="bg-[#226c8f] flex flex-col justify-center items-center p-6 md:p-8 shadow-lg border border-[#226c8f] transition-all duration-300 hover:shadow-xl hover:scale-105 group w-full h-full cursor-pointer"
            style={{ borderRadius: "12px" }}
          >
            <div className="flex flex-col items-center gap-3 md:gap-4">
              <div className="p-3 md:p-4 bg-white/20 group-hover:bg-white/30 transition-all rounded-lg">
                <Video className="w-8 h-8 md:w-12 md:h-12 text-white" />
              </div>
              <div className="text-center">
                <h3 className="text-white text-base md:text-xl font-medium mb-1">
                  Asistencia Virtual
                </h3>
                <p className="text-white/80 text-xs md:text-sm">
                  Registrar clase virtual
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Columna derecha: estadísticas */}
        <div className="bg-white p-4 md:p-6 shadow-lg border border-gray-100 rounded-lg h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-[#226c8f] rounded-sm"></div>
              <h3 className="text-gray-900">Resumen del Mes</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Estadísticas textuales */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">
                    Total Asistencias
                  </span>
                  <span className="text-[#226c8f]">47</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Presenciales</span>
                  <span className="text-[#2c415a]">35 (74%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Virtuales</span>
                  <span className="text-[#226c8f]">12 (26%)</span>
                </div>
              </div>

              {/* Gráfica de pastel */}
              <div>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={distribucionMes}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {distribucionMes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #226c8f",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-2">
                  {distribucionMes.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-xs text-gray-600">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="bg-white p-4 md:p-6 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl"
        style={{ borderRadius: "8px" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-1 h-6 bg-[#226c8f]"
            style={{ borderRadius: "2px" }}
          ></div>
          <h2 className="text-gray-900">Ver Historial de Asistencias</h2>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Seleccione una materia para ver el historial
        </p>
      </div>
      <AsistenciaVirtualModal />
    </div>
  );
}

export default AsistenciasDocente;

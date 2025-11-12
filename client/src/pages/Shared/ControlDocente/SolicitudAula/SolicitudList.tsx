import { useEffect } from "react";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { useAppStore } from "../../../../stores/useAppStore";
import { Badge } from "../../../../components/ui/badge";
import { AnimatedBorderCard } from "../../../../components/ui/AnimatedBorderCard";
import { UserCircle2, Calendar, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function SolicitudList() {
  const navigate = useNavigate();
  const {
    solicitudesAula,
    fetchSolicitudesAula,
    hasLoadedSolicitudes,
    selectSolicitud,
    setModal,
  } = useAppStore();

  // Cargar solicitudes al montar
  useEffect(() => {
    if (!hasLoadedSolicitudes) {
      fetchSolicitudesAula();
    }
  }, [hasLoadedSolicitudes, fetchSolicitudesAula]);

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Aprobada":
        return (
          <Badge
            className="bg-green-600 text-white"
            style={{ borderRadius: "4px" }}
          >
            Aprobada
          </Badge>
        );
      case "Rechazada":
        return (
          <Badge
            className="bg-red-600 text-white"
            style={{ borderRadius: "4px" }}
          >
            Rechazada
          </Badge>
        );
      case "Pendiente":
        return (
          <Badge
            className="bg-yellow-600 text-white"
            style={{ borderRadius: "4px" }}
          >
            Pendiente
          </Badge>
        );
      default:
        return (
          <Badge
            className="bg-gray-600 text-white"
            style={{ borderRadius: "4px" }}
          >
            {estado}
          </Badge>
        );
    }
  };

  const handleSolicitudClick = (id: number) => {
    selectSolicitud(id);
    setModal("solicitudDetail", true);
  };

  return (
    <div
      className="bg-white p-6 shadow-lg border border-gray-100"
      style={{ borderRadius: "8px" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-1 h-6 bg-[#226c8f]"
            style={{ borderRadius: "2px" }}
          ></div>
          <h3 className="text-gray-900">Solicitudes de Aulas</h3>
        </div>
        <button
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#226c8f] hover:text-white bg-transparent hover:bg-[#226c8f] border border-[#226c8f] transition-all duration-300 cursor-pointer"
          style={{ borderRadius: "6px" }}
          onClick={() => navigate("/control-docente/gestionar-solicitudes")}
        >
          <Building2 className="w-4 h-4" />
          <span className="hidden md:inline">Administrar</span>
        </button>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">Solicitudes pendientes</p>
        {/* <p className="text-xs text-gray-500">Total: {solicitudesAulas.length} solicitudes</p> */}
      </div>

      <ScrollArea className="h-[650px]">
        <div className="space-y-3 pr-4">
          {solicitudesAula.map((solicitud) => (
            <AnimatedBorderCard
              key={solicitud.id_solicitud}
              onClick={() => {
                handleSolicitudClick(solicitud.id_solicitud);
              }}
              borderColor="rgba(34, 108, 143, 0.8)"
              gradientFrom="from-blue-50"
              gradientTo="to-cyan-50"
            >
              {/* Ícono de fondo - contenido dentro de la carta */}
              <div className="absolute right-2 bottom-2 opacity-[0.05] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                <Building2 className="w-20 h-20 text-blue-600" />
              </div>

              <div className="relative z-10 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="p-2 bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors"
                      style={{ borderRadius: "6px" }}
                    >
                      <UserCircle2 className="w-4 h-4 text-blue-700" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Docente</p>
                      {/* <p className="text-gray-900">{solicitud.}</p> */}
                    </div>
                  </div>
                  {getEstadoBadge(solicitud.estado)}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div
                    className="bg-white/50 p-2"
                    style={{ borderRadius: "6px" }}
                  >
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <Building2 className="w-3 h-3" /> Aula
                    </p>
                    <p className="text-gray-900 text-sm">
                      Aula {solicitud.nro_aula}
                    </p>
                  </div>
                  <div
                    className="bg-white/50 p-2"
                    style={{ borderRadius: "6px" }}
                  >
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Fecha Solicitada
                    </p>
                    <p className="text-gray-900 text-sm">
                      {solicitud.fecha_solicitada}
                    </p>
                  </div>
                </div>

                <div
                  className="bg-white/40 p-2"
                  style={{ borderRadius: "6px" }}
                >
                  <p className="text-xs text-gray-600 mb-1">Motivo</p>
                  <p className="text-gray-700 text-sm line-clamp-2">
                    {solicitud.motivo}
                  </p>
                </div>
              </div>
            </AnimatedBorderCard>
          ))}

          {solicitudesAula.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay solicitudes registradas</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default SolicitudList;

import { useEffect } from "react";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { useAppStore } from "../../../../stores/useAppStore";
import { Badge } from "../../../../components/ui/badge";

function SolicitudList() {
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
      <div className="flex items-center gap-2 mb-6">
        <div
          className="w-1 h-6 bg-[#226c8f]"
          style={{ borderRadius: "2px" }}
        ></div>
        <h3 className="text-gray-900">Solicitudes de Aulas</h3>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-3 pr-4">
          {solicitudesAula.map((solicitud) => (
            <div
              key={solicitud.id_solicitud}
              onClick={() => handleSolicitudClick(solicitud.id_solicitud)}
              className="border-l-4 border-blue-500 bg-gray-50 p-4 transition-all duration-300 hover:bg-gray-100 cursor-pointer"
              style={{ borderRadius: "0 8px 8px 0" }}
            >
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Código Docente</p>
                    <p className="text-gray-900">
                      {solicitud.asignacion?.codigo_docente || "N/A"}
                    </p>
                  </div>
                  {getEstadoBadge(solicitud.estado)}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Aula</p>
                    <p className="text-gray-900 text-sm">
                      Aula {solicitud.nro_aula}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Fecha Solicitada</p>
                    <p className="text-gray-900 text-sm">
                      {solicitud.fecha_solicitada}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Motivo</p>
                  <p className="text-gray-700 text-sm line-clamp-2">
                    {solicitud.motivo}
                  </p>
                </div>
              </div>
            </div>
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
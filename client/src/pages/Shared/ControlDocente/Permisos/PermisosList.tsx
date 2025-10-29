import { useEffect } from "react";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { useAppStore } from "../../../../stores/useAppStore";
import { Badge } from "../../../../components/ui/badge";

function PermisosList() {
  const {
    permisosDocente,
    fetchPermisosDocente,
    hasLoadedPermisos,
    selectPermiso,
    setModal,
  } = useAppStore();

  // Cargar permisos al montar
  useEffect(() => {
    if (!hasLoadedPermisos) {
      fetchPermisosDocente();
    }
  }, [hasLoadedPermisos, fetchPermisosDocente]);

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Aprobado":
        return (
          <Badge
            className="bg-green-600 text-white"
            style={{ borderRadius: "4px" }}
          >
            Aprobado
          </Badge>
        );
      case "Rechazado":
        return (
          <Badge
            className="bg-red-600 text-white"
            style={{ borderRadius: "4px" }}
          >
            Rechazado
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

  const handlePermisoClick = (id: number) => {
    selectPermiso(id);
    setModal("permisoDetail", true);
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
        <h3 className="text-gray-900">Permisos Docentes</h3>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-3 pr-4">
          {permisosDocente.map((permiso) => (
            <div
              key={permiso.id_permiso}
              onClick={() => handlePermisoClick(permiso.id_permiso)}
              className="border-l-4 border-yellow-500 bg-gray-50 p-4 transition-all duration-300 hover:bg-gray-100 cursor-pointer"
              style={{ borderRadius: "0 8px 8px 0" }}
            >
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Docente</p>
                    <p className="text-gray-900">{permiso.nombre_docente}</p>
                  </div>
                  {getEstadoBadge(permiso.estado)}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Fecha Inicio</p>
                    <p className="text-gray-900 text-sm">
                      {permiso.fecha_inicio}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Fecha Fin</p>
                    <p className="text-gray-900 text-sm">{permiso.fecha_fin}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Motivo</p>
                  <p className="text-gray-700 text-sm line-clamp-2">
                    {permiso.motivo}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {permisosDocente.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay permisos registrados</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default PermisosList;
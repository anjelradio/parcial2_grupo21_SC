import { useEffect } from "react";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { useAppStore } from "../../../../stores/useAppStore";
import { Badge } from "../../../../components/ui/badge";
import {
  AlertCircle,
  UserCircle2,
  Calendar,
  ClipboardCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnimatedBorderCard } from "../../../../components/ui/AnimatedBorderCard";

function PermisosList() {
  const navigate = useNavigate();
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
      className="bg-white p-4 shadow-lg border border-gray-100"
      style={{ borderRadius: "8px" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-1 h-6 bg-[#226c8f]"
            style={{ borderRadius: "2px" }}
          ></div>
          <h3 className="text-gray-900">Permisos Docentes</h3>
        </div>
        <button
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#226c8f] hover:text-white bg-transparent hover:bg-[#226c8f] border border-[#226c8f] transition-all duration-300 cursor-pointer"
          style={{ borderRadius: "6px" }}
          onClick={() => navigate("/control-docente/gestionar-permisos")}
        >
          <ClipboardCheck className="w-4 h-4" />
          <span className="hidden md:inline">Administrar</span>
        </button>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">Permisos pendientes</p>
        <p className="text-xs text-gray-500">
          {/* Total: {solicitudesAulas.length} solicitudes */}
        </p>
      </div>

      <ScrollArea className="h-[650px]">
        <div className="space-y-3 pr-4">
          {permisosDocente.map((permiso) => (
            <AnimatedBorderCard
              key={permiso.id_permiso}
              onClick={() => {
                handlePermisoClick(permiso.id_permiso);
              }}
              borderColor="rgba(234, 179, 8, 0.8)"
              gradientFrom="from-amber-50"
              gradientTo="to-yellow-50"
            >
              {/* Ícono de fondo - contenido dentro de la carta */}
              <div className="absolute right-2 bottom-2 opacity-[0.05] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                <AlertCircle className="w-20 h-20 text-yellow-600" />
              </div>

              <div className="relative z-10 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="p-2 bg-yellow-500/20 group-hover:bg-yellow-500/30 transition-colors"
                      style={{ borderRadius: "6px" }}
                    >
                      <UserCircle2 className="w-4 h-4 text-yellow-700" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Docente</p>
                      <p className="text-gray-900">{permiso.nombre_docente}</p>
                    </div>
                  </div>
                  {getEstadoBadge(permiso.estado)}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div
                    className="bg-white/50 p-2"
                    style={{ borderRadius: "6px" }}
                  >
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Inicio
                    </p>
                    <p className="text-gray-900 text-sm">
                      {permiso.fecha_inicio}
                    </p>
                  </div>
                  <div
                    className="bg-white/50 p-2"
                    style={{ borderRadius: "6px" }}
                  >
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Fin
                    </p>
                    <p className="text-gray-900 text-sm">{permiso.fecha_fin}</p>
                  </div>
                </div>

                <div
                  className="bg-white/40 p-2"
                  style={{ borderRadius: "6px" }}
                >
                  <p className="text-xs text-gray-600 mb-1">Motivo</p>
                  <p className="text-gray-700 text-sm line-clamp-2">
                    {permiso.motivo}
                  </p>
                </div>
              </div>
            </AnimatedBorderCard>
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

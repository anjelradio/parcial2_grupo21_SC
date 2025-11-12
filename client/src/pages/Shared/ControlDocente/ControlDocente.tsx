import { useEffect } from "react";
import SolicitudList from "./SolicitudAula/SolicitudList";
import {
  AlertCircle,
  Building2,
  ClipboardCheck,
  UserCheck,
} from "lucide-react";
import { useAppStore } from "../../../stores/useAppStore";
import PermisosList from "./Permisos/PermisosList";
import PermisoDetail from "./Permisos/PermisoDetail";
import { ToastContainer } from "react-toastify";
import SolicitudDetail from "./SolicitudAula/SolicitudDetail";
import { useNavigate } from "react-router-dom";

function ControlDocente() {
  const navigate = useNavigate();
  const {
    setGlobalLoading,
    fetchPermisosRecientes,
    fetchSolicitudesAula,
    hasLoadedPermisosRecientes,
    hasLoadedSolicitudes,
    fetchStatsControlDocente,
    hasLoadedStatsControlDocente,
    statsControlDocente,
  } = useAppStore();
  useEffect(() => {
    const cargar = async () => {
      if (
        !hasLoadedPermisosRecientes ||
        !hasLoadedSolicitudes ||
        !hasLoadedStatsControlDocente
      )
        setGlobalLoading(true);
      await Promise.all([
        fetchPermisosRecientes(),
        fetchSolicitudesAula(),
        fetchStatsControlDocente(),
      ]);
      setGlobalLoading(false);
    };
    cargar();
  }, [
    fetchPermisosRecientes,
    fetchSolicitudesAula,
    hasLoadedPermisosRecientes,
    hasLoadedSolicitudes,
    setGlobalLoading,
    fetchStatsControlDocente,
    hasLoadedStatsControlDocente,
  ]);

  const permisosTotal = statsControlDocente?.permisos.total;
  const permisosPendientes = statsControlDocente?.permisos.pendientes;
  const permisosAprobados = statsControlDocente?.permisos.aprobados;
  const permisosRechazados = statsControlDocente?.permisos.rechazados;
  const solicitudesAulaTotal = statsControlDocente?.solicitudes_aula.total;
  const suplenciasActivas = statsControlDocente?.suplencias.activas;
  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Control de Docentes y Aulas</h1>
        <p className="text-gray-600">
          Gestiona permisos, licencias y solicitudes
        </p>
      </div>
      {/* Fila superior: Estadística + Botón Suplencias */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Estadísticas / Gráfica */}
        <div
          className="lg:col-span-2 bg-white p-6 shadow-lg border border-gray-100"
          style={{ borderRadius: "8px" }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div
              className="w-1 h-6 bg-[#226c8f]"
              style={{ borderRadius: "2px" }}
            ></div>
            <h3 className="text-gray-900">Resumen de Gestión</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className="bg-yellow-50 p-4 text-center"
              style={{ borderRadius: "8px" }}
            >
              <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-3xl text-yellow-600">{permisosPendientes}</p>
              <p className="text-sm text-gray-600 mt-1">Permisos Pendientes</p>
            </div>

            <div
              className="bg-blue-50 p-4 text-center"
              style={{ borderRadius: "8px" }}
            >
              <Building2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-3xl text-blue-600">{solicitudesAulaTotal}</p>
              <p className="text-sm text-gray-600 mt-1">Solicitudes Aulas</p>
            </div>

            <div
              className="bg-green-50 p-4 text-center"
              style={{ borderRadius: "8px" }}
            >
              <UserCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-3xl text-green-600">{suplenciasActivas}</p>
              <p className="text-sm text-gray-600 mt-1">Suplencias Activas</p>
            </div>
          </div>

          {/* Mini gráfica de estados */}
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-3">
              Distribución de Permisos
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div
                  className="flex-1 bg-gray-200 h-6"
                  style={{ borderRadius: "4px", overflow: "hidden" }}
                >
                  <div
                    className="bg-green-500 h-full"
                    style={{
                      width: `${(permisosAprobados! / permisosTotal!) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-20">Aprobados</span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="flex-1 bg-gray-200 h-6"
                  style={{ borderRadius: "4px", overflow: "hidden" }}
                >
                  <div
                    className="bg-yellow-500 h-full"
                    style={{
                      width: `${(permisosPendientes! / permisosTotal!) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-20">Pendientes</span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="flex-1 bg-gray-200 h-6"
                  style={{ borderRadius: "4px", overflow: "hidden" }}
                >
                  <div
                    className="bg-red-500 h-full"
                    style={{
                      width: `${(permisosRechazados! / permisosTotal!) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-20">Rechazados</span>
              </div>
            </div>
          </div>
        </div>

        {/* Botón Suplencias Docentes */}
        <button
          onClick={() => navigate("/control-docente/gestionar-suplencias")}
          className="bg-[#226c8f] p-8 shadow-lg border border-[#226c8f] transition-all duration-300 hover:shadow-xl hover:scale-105 group cursor-pointer"
          style={{ borderRadius: "8px" }}
        >
          <div className="flex flex-col items-center gap-4 h-full justify-center">
            <div
              className="p-4 bg-white/20 group-hover:bg-white/30 transition-all"
              style={{ borderRadius: "8px" }}
            >
              <ClipboardCheck className="w-12 h-12 text-white" />
            </div>
            <div className="text-center">
              <h3 className="text-white text-xl mb-2">Suplencias Docentes</h3>
              <p className="text-white/80 text-sm">
                Gestiona las suplencias del personal
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Fila inferior: Dos cartas lado a lado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Permisos Docentes */}
        <PermisosList />
        {/* Solicitudes de Aulas */}
        <SolicitudList />
      </div>
      <ToastContainer />
      <PermisoDetail />
      <SolicitudDetail />
    </div>
  );
}

export default ControlDocente;

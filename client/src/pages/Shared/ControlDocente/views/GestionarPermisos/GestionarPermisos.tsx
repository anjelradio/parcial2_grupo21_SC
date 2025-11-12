import { useEffect } from "react";
import { ArrowLeft, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../../../../stores/useAppStore";
import PermisosManageList from "./PermisosManageList";
import PermisoDetail from "../../Permisos/PermisoDetail";
import { ToastContainer } from "react-toastify";

function GestionarPermisos() {
  const navigate = useNavigate();
  const {
    user,
    hasLoadedPermisos,
    fetchPermisosDocente,
    setGlobalLoading,
    permisosDocente,
  } = useAppStore();
  useEffect(() => {
    const cargar = async () => {
      if (!hasLoadedPermisos) {
        setGlobalLoading(true);
        await fetchPermisosDocente({ page: 1, page_size: 9 });
        setGlobalLoading(false);
      }
    };
    cargar();
  }, [fetchPermisosDocente, hasLoadedPermisos, setGlobalLoading]);

  const backURL = () => {
    if (!user) return "/";
    if (user.rol === "ADMIN") return "/admin/control-docente";
    else if (user.rol === "AUTORIDAD") return "/autoridad/control-docente";
    return "/";
  };

  // Para las estadisticas
  const totalPermisos = permisosDocente?.length;
  const pendientes = permisosDocente?.filter(
    (permiso) => permiso.estado === "Pendiente"
  ).length;
  const aprobados = permisosDocente?.filter(
    (permiso) => permiso.estado === "Aprobado"
  ).length;
  const rechazados = permisosDocente?.filter(
    (permiso) => permiso.estado === "Rechazado"
  ).length;
  return (
    <div className="space-y-6">
      {/* Header con botón de regreso */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(backURL())}
          className="p-2 text-gray-600 hover:text-[#226c8f] hover:bg-gray-100 transition-colors"
          style={{ borderRadius: "8px" }}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-gray-900">Administrar Permisos Docentes</h1>
          <p className="text-gray-600">
            Gestión completa de solicitudes de permisos
          </p>
        </div>
      </div>

      {/* Estadísticas */}
      <div
        className="bg-white p-6 shadow-lg border border-gray-100"
        style={{ borderRadius: "8px" }}
      >
        <div className="flex items-center gap-2 mb-6">
          <div
            className="w-1 h-6 bg-[#226c8f]"
            style={{ borderRadius: "2px" }}
          ></div>
          <h3 className="text-gray-900">Resumen de Permisos</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            className="bg-[#226c8f]/10 p-4 text-center"
            style={{ borderRadius: "8px" }}
          >
            <FileText className="w-8 h-8 text-[#226c8f] mx-auto mb-2" />
            <p className="text-3xl text-[#226c8f]">{totalPermisos}</p>
            <p className="text-sm text-gray-600 mt-1">Total</p>
          </div>

          <div
            className="bg-yellow-50 p-4 text-center"
            style={{ borderRadius: "8px" }}
          >
            <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-3xl text-yellow-600">{pendientes}</p>
            <p className="text-sm text-gray-600 mt-1">Pendientes</p>
          </div>

          <div
            className="bg-green-50 p-4 text-center"
            style={{ borderRadius: "8px" }}
          >
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-3xl text-green-600">{aprobados}</p>
            <p className="text-sm text-gray-600 mt-1">Aprobados</p>
          </div>

          <div
            className="bg-red-50 p-4 text-center"
            style={{ borderRadius: "8px" }}
          >
            <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-3xl text-red-600">{rechazados}</p>
            <p className="text-sm text-gray-600 mt-1">Rechazados</p>
          </div>
        </div>
      </div>

      {/* Buscador, filtros y lista */}
      <PermisosManageList />
      <PermisoDetail />
      <ToastContainer />
    </div>
  );
}

export default GestionarPermisos;

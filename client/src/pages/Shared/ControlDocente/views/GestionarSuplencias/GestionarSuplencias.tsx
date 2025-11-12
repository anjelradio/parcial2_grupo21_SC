import { useEffect } from "react";
import { ArrowLeft, UserCheck, CheckCircle, XCircle } from "lucide-react";
import { useAppStore } from "../../../../../stores/useAppStore";
import { useNavigate } from "react-router-dom";
import AddSuplenciaForm from "./AddSuplenciaForm";
import SuplenciasManageList from "./SuplenciasManageList";
import { ToastContainer } from "react-toastify";
import EditSuplenciaModal from "./Modals/EditSuplenciaModal";
import DeleteSuplenciaModal from "./Modals/DeleteSuplenciaModal";

function GestionarSuplencias() {
  const { user, fetchDocentes, setGlobalLoading, hasLoadedDocentes, suplencias } =
    useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    const cargar = async () => {
      if (!hasLoadedDocentes) setGlobalLoading(true);
      await Promise.all([fetchDocentes()]);
      setGlobalLoading(false);
    };
    cargar();
  }, [fetchDocentes, hasLoadedDocentes, setGlobalLoading]);

  const backURL = () => {
    if (!user) return "/";
    if (user.rol === "ADMIN") return "/admin/control-docente";
    else if (user.rol === "AUTORIDAD") return "/autoridad/control-docente";
    return "/";
  };
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
          <h1 className="text-gray-900">Suplencias Docentes</h1>
          <p className="text-gray-600">
            Gestiona y registra suplencias del personal docente
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
          <h3 className="text-gray-900">Resumen de Suplencias</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div
            className="bg-[#226c8f]/10 p-4 text-center"
            style={{ borderRadius: "8px" }}
          >
            <UserCheck className="w-8 h-8 text-[#226c8f] mx-auto mb-2" />
            <p className="text-3xl text-[#226c8f]">{suplencias?.length}</p>
            <p className="text-sm text-gray-600 mt-1">Total</p>
          </div>

          <div
            className="bg-green-50 p-4 text-center"
            style={{ borderRadius: "8px" }}
          >
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-3xl text-green-600">{suplencias?.filter(suplencia => suplencia.estado === "Activa").length}</p>
            <p className="text-sm text-gray-600 mt-1">Activas</p>
          </div>

          <div
            className="bg-gray-50 p-4 text-center"
            style={{ borderRadius: "8px" }}
          >
            <XCircle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-3xl text-gray-600">{suplencias?.filter(suplencia => suplencia.estado === "Finalizada").length}</p>
            <p className="text-sm text-gray-600 mt-1">Finalizadas</p>
          </div>
        </div>
      </div>

      <AddSuplenciaForm/>

      {/* Filtros para Suplencias Registradas */}
      <SuplenciasManageList/>
      <EditSuplenciaModal/>
      <DeleteSuplenciaModal/>
      <ToastContainer/>
    </div>
  );
}

export default GestionarSuplencias;

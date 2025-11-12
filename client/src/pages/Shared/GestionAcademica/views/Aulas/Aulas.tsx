import {
  ArrowLeft,
  Building2,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { ScrollArea } from "../../../../../components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../../../../stores/useAppStore";
import AddAulaForm from "./AddAulaForm";
import AulaCard from "./AulaCard";
import { ToastContainer } from "react-toastify";
import EditAula from "./Modals/EditAula";
import DeleteAula from "./Modals/DeleteAula";
function Aulas() {
  const navigate = useNavigate();
  const { aulas } = useAppStore();
  return (
    <div className="space-y-8">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/gestion-academica")}
          className="p-2 hover:bg-gray-100 transition-colors"
          style={{ borderRadius: "8px" }}
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-gray-900 mb-2">Gestión de Aulas</h1>
          <p className="text-gray-600">Administra las aulas y laboratorios</p>
        </div>
      </div>

      {/* Estadísticas de Aulas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div
          className="bg-white p-6 shadow-lg border border-gray-100"
          style={{ borderRadius: "8px" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="p-3 bg-[#226c8f]/10"
              style={{ borderRadius: "8px" }}
            >
              <Building2 className="w-6 h-6 text-[#226c8f]" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Total Aulas</p>
              <p className="text-2xl text-[#226c8f]">{aulas.length}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">En el sistema</p>
        </div>

        <div
          className="bg-white p-6 shadow-lg border border-gray-100"
          style={{ borderRadius: "8px" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="p-3 bg-green-500/10"
              style={{ borderRadius: "8px" }}
            >
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Disponibles</p>
              <p className="text-2xl text-[#226c8f]">
                {aulas.filter((a) => a.estado === "Disponible").length}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500">Listas para usar</p>
        </div>

        <div
          className="bg-white p-6 shadow-lg border border-gray-100"
          style={{ borderRadius: "8px" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="p-3 bg-yellow-500/10"
              style={{ borderRadius: "8px" }}
            >
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">En Mantenimiento</p>
              <p className="text-2xl text-[#226c8f]">
                {aulas.filter((a) => a.estado === "Mantenimiento").length}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500">Temporalmente cerradas</p>
        </div>

        <div
          className="bg-white p-6 shadow-lg border border-gray-100"
          style={{ borderRadius: "8px" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-red-500/10" style={{ borderRadius: "8px" }}>
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Inactivas</p>
              <p className="text-2xl text-[#226c8f]">
                {aulas.filter((a) => a.estado === "Inactiva").length}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500">Fuera de servicio</p>
        </div>
      </div>

      {/* Formulario de Nueva Aula */}
      <AddAulaForm />

      {[0, 1, 2, 3, 4].map((piso) => {
        const aulasDelPiso = aulas.filter((a) =>
          a.nro_aula.startsWith(piso.toString())
        );
        if (aulasDelPiso.length === 0) return null;
        const pisoColors = {
          1: "bg-blue-500/10 border-blue-500",
          2: "bg-indigo-500/10 border-indigo-500",
          3: "bg-purple-500/10 border-purple-500",
          4: "bg-[#226c8f]/10 border-[#226c8f]",
        };

        const pisoTextColors = {
          1: "text-blue-600",
          2: "text-indigo-600",
          3: "text-purple-600",
          4: "text-[#226c8f]",
        };
        return (
            <div
              key={piso}
              className="bg-white shadow-lg border border-gray-100 "
              style={{ borderRadius: "12px" }}
            >
              {/* Encabezado del Piso */}
              <div
                className={`${
                  pisoColors[piso as keyof typeof pisoColors]
                } border-l-4 p-5`}
                style={{
                  borderTopLeftRadius: "12px",
                  borderTopRightRadius: "12px",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="p-2.5 bg-white/80"
                    style={{ borderRadius: "8px" }}
                  >
                    <Building2
                      className={`w-6 h-6 ${
                        pisoTextColors[piso as keyof typeof pisoTextColors]
                      }`}
                    />
                  </div>
                  <div>
                    <h3
                      className={`${
                        pisoTextColors[piso as keyof typeof pisoTextColors]
                      }`}
                    >
                      Piso {piso}
                    </h3>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {aulasDelPiso.length}{" "}
                      {aulasDelPiso.length === 1 ? "aula" : "aulas"} en este
                      piso
                    </p>
                  </div>
                </div>
              </div>

              {/* Lista Scrolleable de Aulas */}
              <ScrollArea className="h-[400px] p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {aulasDelPiso.map((aula) => (
                    <AulaCard key={aula.nro_aula} aula={aula} />
                  ))}
                </div>
              </ScrollArea>
            </div>
        );
      })}
      <ToastContainer />
      <EditAula />
      <DeleteAula />
    </div>
  );
}

export default Aulas;

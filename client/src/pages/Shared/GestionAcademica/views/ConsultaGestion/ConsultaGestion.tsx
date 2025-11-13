import { useEffect } from "react";
import { ArrowLeft, BookOpen, School, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../../../../stores/useAppStore";
import DocentesActivosList from "./DocentesActivosList";
import GruposMateriasList from "./GruposMateriasList";

function ConsultaGestion() {
  const {
    gestiones,
    selectedGestionId,
    fetchEstadisticasGestion,
    estadisticasGestion,
    hasLoadedEstadisticasGestion,
    setGlobalLoading,
    fetchGruposMateriasGestion,
    hasLoadedGruposGestion,
    fetchDocentesGestion,
    hasLoadedDocentesGestion,
  } = useAppStore();
  const navigate = useNavigate();

  const gestionSeleccionada = gestiones.find(
    (gestion) => gestion.id_gestion === selectedGestionId
  );
  useEffect(() => {
    const cargar = async () => {
      if (
        !hasLoadedEstadisticasGestion &&
        !hasLoadedDocentesGestion &&
        !hasLoadedGruposGestion
      ) {
        setGlobalLoading(true);
        await Promise.all([
          fetchEstadisticasGestion(selectedGestionId!),
          fetchDocentesGestion({ page: 1, page_size: 10 }),
          fetchGruposMateriasGestion({page: 1, page_size: 10}),
        ]);
      }
    };
    cargar();
  }, [
    hasLoadedEstadisticasGestion,
    hasLoadedDocentesGestion,
    hasLoadedGruposGestion,
    fetchEstadisticasGestion,
    fetchDocentesGestion,
    fetchGruposMateriasGestion,
    setGlobalLoading,
  ]);
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
          <h1 className="text-gray-900 mb-1">
            {gestionSeleccionada?.descripcion}
          </h1>
          <p className="text-gray-600 text-sm">
            {gestionSeleccionada?.fecha_inicio} -{" "}
            {gestionSeleccionada?.fecha_fin}
          </p>
        </div>
      </div>

      {/* Estadísticas del semestre */}
      <div
        className="bg-white p-6 shadow-lg border border-gray-100"
        style={{ borderRadius: "8px" }}
      >
        <div className="flex items-center gap-2 mb-6">
          <div
            className="w-1 h-6 bg-[#226c8f]"
            style={{ borderRadius: "2px" }}
          ></div>
          <h3 className="text-gray-900">Resumen de Gestion</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div
            className="bg-[#226c8f]/10 p-4 text-center"
            style={{ borderRadius: "8px" }}
          >
            <Users className="w-8 h-8 text-[#226c8f] mx-auto mb-2" />
            <p className="text-3xl text-[#226c8f]">
              {estadisticasGestion?.total_docentes_activos}
            </p>
            <p className="text-sm text-gray-600 mt-1">Docentes Activos</p>
          </div>

          <div
            className="bg-yellow-50 p-4 text-center"
            style={{ borderRadius: "8px" }}
          >
            <BookOpen className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-3xl text-yellow-600">
              {estadisticasGestion?.total_materias_activas}
            </p>
            <p className="text-sm text-gray-600 mt-1">Materias</p>
          </div>

          <div
            className="bg-green-50 p-4 text-center"
            style={{ borderRadius: "8px" }}
          >
            <School className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-3xl text-green-600">
              {estadisticasGestion?.total_grupos_activos}
            </p>
            <p className="text-sm text-gray-600 mt-1">Grupos Activos</p>
          </div>
        </div>
      </div>

      {/* Dos columnas: Docentes y Grupos/Materias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna izquierda: Docentes Activos */}
        <DocentesActivosList />

        {/* Columna derecha: Grupos y Materias */}
        <GruposMateriasList />
      </div>
    </div>
  );
}

export default ConsultaGestion;

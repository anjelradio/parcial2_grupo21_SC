import { useEffect } from "react";
import { BookOpen, Users, Building2, CheckCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../../stores/useAppStore";

function GestionAcademica() {
  const navigate = useNavigate();
  const {
    fetchAulas,
    fetchGrupos,
    fetchMaterias,
    hasLoadedAulas,
    hasLoadedGrupos,
    hasLoadedMaterias,
    setGlobalLoading,
    materias,
    grupos,
    aulas
  } = useAppStore();

  useEffect(() => {
    const cargar = async () => {
      if (!hasLoadedAulas || !hasLoadedGrupos || !hasLoadedMaterias)
        setGlobalLoading(true);
      await Promise.all([fetchAulas(), fetchGrupos(), fetchMaterias()]);
      setGlobalLoading(false);
    };
    cargar();
  }, [
    fetchAulas,
    fetchGrupos,
    fetchMaterias,
    setGlobalLoading,
    hasLoadedAulas,
    hasLoadedGrupos,
    hasLoadedMaterias,
  ]);

  const totalMaterias = materias ? materias.length : 0
  const totalGrupos = grupos ? grupos.length : 0
  const totalAulas = aulas ? aulas.length : 0
  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Gestión Académica</h1>
        <p className="text-gray-600">
          Administra materias, grupos, aulas y períodos académicos
        </p>
      </div>

      {/* Grid de secciones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Botón Materias */}
        <button
          onClick={() => navigate("/gestion-academica/gestionar-materias")}
          className="bg-[#226c8f] p-8 shadow-lg border border-[#226c8f] transition-all duration-300 hover:shadow-xl hover:scale-105 group"
          style={{ borderRadius: "8px" }}
        >
          <div className="flex flex-col items-center gap-4">
            <div
              className="p-4 bg-white/20 group-hover:bg-white/30 transition-all"
              style={{ borderRadius: "8px" }}
            >
              <BookOpen className="w-12 h-12 text-white" />
            </div>
            <div className="text-center">
              <h3 className="text-white text-xl mb-2">Materias</h3>
              <p className="text-white/80 text-sm">
                {totalMaterias} materias registradas
              </p>
            </div>
          </div>
        </button>

        {/* Botón Grupos */}
        <button
          onClick={() => navigate("/gestion-academica/gestionar-grupos")}
          className="bg-[#226c8f] p-8 shadow-lg border border-[#226c8f] transition-all duration-300 hover:shadow-xl hover:scale-105 group"
          style={{ borderRadius: "8px" }}
        >
          <div className="flex flex-col items-center gap-4">
            <div
              className="p-4 bg-white/20 group-hover:bg-white/30 transition-all"
              style={{ borderRadius: "8px" }}
            >
              <Users className="w-12 h-12 text-white" />
            </div>
            <div className="text-center">
              <h3 className="text-white text-xl mb-2">Grupos</h3>
              <p className="text-white/80 text-sm">
                {totalGrupos} grupos activos
              </p>
            </div>
          </div>
        </button>

        {/* Botón Aulas */}
        <button
          onClick={() => navigate("/gestion-academica/gestionar-aulas")}
          className="bg-[#226c8f] p-8 shadow-lg border border-[#226c8f] transition-all duration-300 hover:shadow-xl hover:scale-105 group"
          style={{ borderRadius: "8px" }}
        >
          <div className="flex flex-col items-center gap-4">
            <div
              className="p-4 bg-white/20 group-hover:bg-white/30 transition-all"
              style={{ borderRadius: "8px" }}
            >
              <Building2 className="w-12 h-12 text-white" />
            </div>
            <div className="text-center">
              <h3 className="text-white text-xl mb-2">Aulas</h3>
              <p className="text-white/80 text-sm">
                {totalAulas} aulas disponibles
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Bloques y Días Académicos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="bg-white p-6 shadow-lg border border-gray-100"
          style={{ borderRadius: "8px" }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div
              className="w-1 h-6 bg-[#226c8f]"
              style={{ borderRadius: "2px" }}
            ></div>
            <h3 className="text-gray-900">Bloques Horarios</h3>
          </div>
          <div className="space-y-3">
            {[
              "08:00 - 10:00",
              "10:00 - 12:00",
              "14:00 - 16:00",
              "16:00 - 18:00",
            ].map((bloque, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50"
                style={{ borderRadius: "8px" }}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#226c8f]" />
                  <span className="text-gray-900">{bloque}</span>
                </div>
                <span className="text-sm text-gray-500">
                  Bloque {index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="bg-white p-6 shadow-lg border border-gray-100"
          style={{ borderRadius: "8px" }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div
              className="w-1 h-6 bg-[#226c8f]"
              style={{ borderRadius: "2px" }}
            ></div>
            <h3 className="text-gray-900">Días Académicos</h3>
          </div>
          <div className="space-y-3">
            {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"].map(
              (dia, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50"
                  style={{ borderRadius: "8px" }}
                >
                  <span className="text-gray-900">{dia}</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GestionAcademica;

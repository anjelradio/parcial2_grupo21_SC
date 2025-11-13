import { useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { BookOpen, Users, Building2, CheckCircle, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../../stores/useAppStore";
import { ToastContainer } from "react-toastify";
import HorarioList from "./Modals/Horarios/HorarioList";
import EditHorario from "./Modals/Horarios/EditHorario";
import DeleteHorario from "./Modals/Horarios/DeleteHorario";
import DiaList from "./Modals/Dias/DiaList";
import DeleteDia from "./Modals/Dias/DeleteDia";
import EditDia from "./Modals/Dias/EditDia";
import AddSemestreForm from "./AddSemestreForm";
import { ScrollArea } from "../../../components/ui/scroll-area";



function GestionAcademica() {

  const navigate = useNavigate();
  const {
    fetchAulas,
    fetchGrupos,
    fetchMaterias,
    fetchBloquesHorarios,
    fetchDias,
    hasLoadedAulas,
    hasLoadedGrupos,
    hasLoadedMaterias,
    hasLoadedBloquesHorarios,
    hasLoadedDias,
    setGlobalLoading,
    materias,
    grupos,
    aulas,
    bloquesHorarios,
    dias,
    setModal,
    fetchGestiones,
    gestiones,
    hasLoadedGestiones,
    selectGestion
  } = useAppStore();

  useEffect(() => {
    const cargar = async () => {
      if (
        !hasLoadedAulas ||
        !hasLoadedGrupos ||
        !hasLoadedMaterias ||
        !hasLoadedBloquesHorarios ||
        !hasLoadedDias ||
        !hasLoadedGestiones
      )
        setGlobalLoading(true);
      await Promise.all([
        fetchAulas(),
        fetchGrupos(),
        fetchMaterias(),
        fetchBloquesHorarios(),
        fetchDias(),
        fetchGestiones(),
      ]);
      setGlobalLoading(false);
    };
    cargar();
  }, [
    fetchAulas,
    fetchGrupos,
    fetchMaterias,
    fetchBloquesHorarios,
    fetchDias,
    fetchGestiones,
    setGlobalLoading,
    hasLoadedAulas,
    hasLoadedGrupos,
    hasLoadedMaterias,
    hasLoadedDias,
    hasLoadedGestiones,
  ]);

  const totalMaterias = materias ? materias.length : 0;
  const totalGrupos = grupos ? grupos.length : 0;
  const totalAulas = aulas ? aulas.length : 0;

  // Función para obtener el turno según la hora de inicio
  function obtenerTurno(horaInicio: string): "Mañana" | "Tarde" | "Noche" {
    // Extrae la hora como número (ej: "07:30" -> 7.5)
    const [h, m] = horaInicio.split(":").map(Number);
    const horaDecimal = h + m / 60;

    if (horaDecimal >= 6 && horaDecimal < 12) return "Mañana";
    if (horaDecimal >= 12 && horaDecimal < 18) return "Tarde";
    return "Noche";
  }
  const onAdministrarHorarios = () => {
    setModal("horarioList", true);
  };
  const onAdministrarDias = () => {
    setModal("diasList", true);
  };

  const handleClick = (idGestion: number) => {
    selectGestion(idGestion)
    navigate("/gestion-academica/consulta-gestion")
  }
  return (
    <div className="space-y-0 md:space-y-8">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Gestión Académica</h1>
        <p className="text-gray-600">
          Administra materias, grupos, aulas y períodos académicos
        </p>
      </div>

      {/* Grid de secciones */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        {/* Botón Materias */}
        <button
          onClick={() => navigate("/gestion-academica/gestionar-materias")}
          className="bg-[#226c8f] p-4 md:p-8 shadow-lg border border-[#226c8f] transition-all duration-300 hover:shadow-xl hover:scale-105 group"
          style={{ borderRadius: "8px" }}
        >
          <div className="flex flex-col items-center gap-2 md:gap-4">
            <div
              className="p-2 md:p-4 bg-white/20 group-hover:bg-white/30 transition-all"
              style={{ borderRadius: "8px" }}
            >
              <BookOpen className="w-8 h-8 md:w-12 md:h-12 text-white" />
            </div>
            <div className="text-center">
              <h3 className="text-white text-base md:text-xl mb-1 md:mb-2">
                Materias
              </h3>
              <p className="text-white/80 text-xs md:text-sm">
                {totalMaterias} materias registradas
              </p>
            </div>
          </div>
        </button>

        {/* Botón Grupos */}
        <button
          onClick={() => navigate("/gestion-academica/gestionar-grupos")}
          className="bg-[#226c8f] p-4 md:p-8 shadow-lg border border-[#226c8f] transition-all duration-300 hover:shadow-xl hover:scale-105 group"
          style={{ borderRadius: "8px" }}
        >
          <div className="flex flex-col items-center gap-2 md:gap-4">
            <div
              className="p-2 md:p-4 bg-white/20 group-hover:bg-white/30 transition-all"
              style={{ borderRadius: "8px" }}
            >
              <Users className="w-8 h-8 md:w-12 md:h-12 text-white" />
            </div>
            <div className="text-center">
              <h3 className="text-white text-base md:text-xl mb-1 md:mb-2">
                Grupos
              </h3>
              <p className="text-white/80 text-xs md:text-sm">
                {totalGrupos} grupos activos
              </p>
            </div>
          </div>
        </button>

        {/* Botón Aulas */}
        <button
          onClick={() => navigate("/gestion-academica/gestionar-aulas")}
          className="bg-[#226c8f] p-4 md:p-8 shadow-lg border border-[#226c8f] transition-all duration-300 hover:shadow-xl hover:scale-105 group col-span-2 md:col-span-1"
          style={{ borderRadius: "8px" }}
        >
          <div className="flex flex-col items-center gap-2 md:gap-4">
            <div
              className="p-2 md:p-4 bg-white/20 group-hover:bg-white/30 transition-all"
              style={{ borderRadius: "8px" }}
            >
              <Building2 className="w-8 h-8 md:w-12 md:h-12 text-white" />
            </div>
            <div className="text-center">
              <h3 className="text-white text-base md:text-xl mb-1 md:mb-2">
                Aulas
              </h3>
              <p className="text-white/80 text-xs md:text-sm">
                {totalAulas} aulas disponibles
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Bloques y Días Académicos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 md:mt-0">
        {/* Bloques Horarios */}
        <div
          className="bg-white p-6 shadow-lg border border-gray-100"
          style={{ borderRadius: "8px" }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div
                className="w-1 h-6 bg-[#226c8f]"
                style={{ borderRadius: "2px" }}
              ></div>
              <h3 className="text-gray-900">Bloques Horarios</h3>
            </div>
            <button
              onClick={() => onAdministrarHorarios()}
              className="px-4 py-2 bg-[#226c8f] text-white hover:bg-[#1a5470] transition-colors text-sm"
              style={{ borderRadius: "8px" }}
            >
              Administrar
            </button>
          </div>

          {/* Estadísticas visuales */}
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div
                className="bg-blue-50 p-3 text-center"
                style={{ borderRadius: "8px" }}
              >
                <p className="text-2xl text-[#226c8f]">
                  {
                    bloquesHorarios.filter(
                      (b) => obtenerTurno(b.hora_inicio) === "Mañana"
                    ).length
                  }
                </p>
                <p className="text-xs text-gray-600 mt-1">Mañana</p>
              </div>
              <div
                className="bg-green-50 p-3 text-center"
                style={{ borderRadius: "8px" }}
              >
                <p className="text-2xl text-[#226c8f]">
                  {
                    bloquesHorarios.filter(
                      (b) => obtenerTurno(b.hora_inicio) === "Tarde"
                    ).length
                  }
                </p>
                <p className="text-xs text-gray-600 mt-1">Tarde</p>
              </div>
              <div
                className="bg-purple-50 p-3 text-center"
                style={{ borderRadius: "8px" }}
              >
                <p className="text-2xl text-[#226c8f]">
                  {
                    bloquesHorarios.filter(
                      (b) => obtenerTurno(b.hora_inicio) === "Noche"
                    ).length
                  }
                </p>
                <p className="text-xs text-gray-600 mt-1">Noche</p>
              </div>
            </div>

            {/* Gráfico simple */}
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      turno: "Mañana",
                      bloques: bloquesHorarios.filter(
                        (b) => obtenerTurno(b.hora_inicio) === "Mañana"
                      ).length,
                    },
                    {
                      turno: "Tarde",
                      bloques: bloquesHorarios.filter(
                        (b) => obtenerTurno(b.hora_inicio) === "Tarde"
                      ).length,
                    },
                    {
                      turno: "Noche",
                      bloques: bloquesHorarios.filter(
                        (b) => obtenerTurno(b.hora_inicio) === "Noche"
                      ).length,
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="turno" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bloques" fill="#226c8f" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <p className="text-sm text-gray-600 text-center">
                Total de bloques:{" "}
                <span className="text-[#226c8f]">{bloquesHorarios.length}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Días Académicos */}
        <div
          className="bg-white p-6 shadow-lg border border-gray-100"
          style={{ borderRadius: "8px" }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div
                className="w-1 h-6 bg-[#226c8f]"
                style={{ borderRadius: "2px" }}
              ></div>
              <h3 className="text-gray-900">Días Académicos</h3>
            </div>
            <button
              onClick={() => onAdministrarDias()}
              className="px-4 py-2 bg-[#226c8f] text-white hover:bg-[#1a5470] transition-colors text-sm"
              style={{ borderRadius: "8px" }}
            >
              Administrar
            </button>
          </div>

          {/* Estadísticas visuales */}
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <ResponsiveContainer width={200} height={200}>
                  <PieChart>
                    <Pie
                      data={[{ name: "Días", value: dias.length }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={0}
                      dataKey="value"
                      startAngle={90}
                      endAngle={450}
                    >
                      <Cell fill="#226c8f" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-3xl text-[#226c8f]">{dias.length}</p>
                  <p className="text-xs text-gray-600">Días</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {dias.slice(0, 3).map((dia) => (
                <div
                  key={dia.id_dia}
                  className="flex items-center justify-between p-2 bg-gray-50"
                  style={{ borderRadius: "8px" }}
                >
                  <span className="text-sm text-gray-900">{dia.nombre}</span>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
              ))}
              {dias.length > 3 && (
                <p className="text-xs text-gray-500 text-center pt-1">
                  +{dias.length - 3} más
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Gestión Semestral - Layout 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Columna izquierda 30%: Formulario Crear Semestre */}
        <div className="lg:col-span-3 mt-6 md:mt-0">
          <AddSemestreForm />
        </div>

        {/* Columna derecha 70%: Listado de Semestres */}
        <div className="lg:col-span-7">
          <div
            className="bg-white p-6 shadow-lg border border-gray-100"
            style={{ borderRadius: "8px" }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div
                className="w-1 h-6 bg-[#226c8f]"
                style={{ borderRadius: "2px" }}
              ></div>
              <h3 className="text-gray-900">Semestres Registrados</h3>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
                {gestiones.map((gestion) => (
                  <div
                    key={gestion.id_gestion}
                    className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 border-2 border-transparent hover:border-blue-400 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md relative"
                    style={{ borderRadius: "8px" }}
                    onClick={() => handleClick(gestion.id_gestion)}
                  >
                    {gestion.vigente && (
                      <div className="absolute top-3 right-3">
                        <span
                          className="px-2 py-1 bg-green-600 text-white text-xs"
                          style={{ borderRadius: "4px" }}
                        >
                          Activo
                        </span>
                      </div>
                    )}

                    <div className="absolute right-2 bottom-2 opacity-[0.05] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                      <Calendar className="w-20 h-20 text-blue-600" />
                    </div>

                    <div className="relative z-10 space-y-3">
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="p-2 bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors"
                          style={{ borderRadius: "6px" }}
                        >
                          <Calendar className="w-5 h-5 text-blue-700" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Semestre</p>
                          <p className="text-gray-900">
                            {gestion.descripcion}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div
                          className="bg-white/50 p-2"
                          style={{ borderRadius: "6px" }}
                        >
                          <p className="text-xs text-gray-600">Fecha Inicio</p>
                          <p className="text-gray-900 text-sm">
                            {new Date(gestion.fecha_inicio).toLocaleDateString(
                              "es-ES",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <div
                          className="bg-white/50 p-2"
                          style={{ borderRadius: "6px" }}
                        >
                          <p className="text-xs text-gray-600">Fecha Fin</p>
                          <p className="text-gray-900 text-sm">
                            {new Date(gestion.fecha_fin).toLocaleDateString(
                              "es-ES",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      <ToastContainer />
      <HorarioList />
      <EditHorario />
      <DeleteHorario />
      <DiaList />
      <EditDia />
      <DeleteDia />
    </div>
  );
}

export default GestionAcademica;

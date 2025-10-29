import { useState, useEffect } from "react";
import { BookOpen, Search } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { ScrollArea } from "../../../components/ui/scroll-area";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "../../../components/ui/select";
import AddAsignacion from "./AddAsignacion";
import AsignacionCard from "./AsignacionCard";
import { ToastContainer } from "react-toastify";
import EditAsignacion from "./EditAsignacion";
import DeleteAsignacion from "./DeleteAsignacion";
import { useAppStore } from "../../../stores/useAppStore";

function Asignaciones() {
  const {
    asignaciones,
    fetchAsignaciones,
    fetchUsers,
    fetchMaterias,
    fetchGrupos,
    fetchDias,
    fetchBloquesHorarios,
    fetchAulas,
    hasLoadedAsignaciones,
    hasLoadedAulas,
    hasLoadedUsers,
    hasLoadedGrupos,
    hasLoadedBloquesHorarios,
    hasLoadedMaterias,
    hasLoadedDias,
    setGlobalLoading,
  } = useAppStore();

  const [searchDocente, setSearchDocente] = useState("");
  const [selectedSemestre, setSelectedSemestre] = useState("2025-2"); // Cambiado a 2025-2

  useEffect(() => {
    const cargar = async () => {
      console.log("=== INICIANDO CARGA DE DATOS ===");
      console.log("Estado de carga:", {
        hasLoadedAulas,
        hasLoadedGrupos,
        hasLoadedMaterias,
        hasLoadedBloquesHorarios,
        hasLoadedDias,
        hasLoadedUsers,
        hasLoadedAsignaciones,
      });

      if (
        !hasLoadedAulas ||
        !hasLoadedGrupos ||
        !hasLoadedMaterias ||
        !hasLoadedBloquesHorarios ||
        !hasLoadedDias ||
        !hasLoadedUsers ||
        !hasLoadedAsignaciones
      )
        setGlobalLoading(true);

      await Promise.all([
        fetchAulas(),
        fetchGrupos(),
        fetchMaterias(),
        fetchBloquesHorarios(),
        fetchAsignaciones(),
        fetchDias(),
        fetchUsers(),
      ]);

      console.log("=== CARGA COMPLETADA ===");
      setGlobalLoading(false);
    };
    cargar();
  }, [
    fetchAulas,
    fetchGrupos,
    fetchMaterias,
    fetchBloquesHorarios,
    fetchDias,
    fetchUsers,
    fetchAsignaciones,
    setGlobalLoading,
    hasLoadedAulas,
    hasLoadedGrupos,
    hasLoadedMaterias,
    hasLoadedDias,
    hasLoadedUsers,
    hasLoadedAsignaciones,
    hasLoadedBloquesHorarios,
  ]);

  // Debug: Mostrar asignaciones cargadas
  useEffect(() => {
    console.log("Asignaciones actuales:", asignaciones);
    console.log("Total de asignaciones:", asignaciones.length);
  }, [asignaciones]);

  // Filtrar asignaciones con validación mejorada
  const asignacionesFiltradas = asignaciones.filter((a) => {
    // Debug de cada asignación (solo la primera vez)
    if (asignaciones.length > 0 && asignaciones.indexOf(a) === 0) {
      console.log("Ejemplo de estructura de asignación:", a);
      console.log("Gestión nombre_gestion:", a.gestion?.nombre_gestion);
    }

    // Filtro por semestre - construir el nombre igual que el backend
    const gestionNombre =
      a.gestion?.nombre_gestion ||
      (a.gestion ? `${a.gestion.anio}-${a.gestion.semestre}` : "");
    const cumpleSemestre = gestionNombre === selectedSemestre;

    // Filtro por docente
    const nombreDocente = a.docente?.nombre_completo?.toLowerCase() || "";
    const cumpleDocente = nombreDocente.includes(searchDocente.toLowerCase());

    return cumpleSemestre && cumpleDocente;
  });

  console.log("Asignaciones filtradas:", asignacionesFiltradas.length);
  console.log("Filtros aplicados:", { selectedSemestre, searchDocente });

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Gestión de Asignaciones</h1>
        <p className="text-gray-600">
          Asigna docentes, materias, grupos y aulas
        </p>
      </div>

      {/* Formulario de nueva asignación */}
      <AddAsignacion />

      {/* Lista de asignaciones */}
      <div
        className="bg-white p-6 shadow-lg border border-gray-100"
        style={{ borderRadius: "8px" }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div
              className="w-1 h-6 bg-[#226c8f]"
              style={{ borderRadius: "2px" }}
            ></div>
            <h3 className="text-gray-900">Asignaciones Registradas</h3>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
            {/* Barra de búsqueda */}
            <div className="relative flex-1 md:min-w-[280px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por docente..."
                value={searchDocente}
                onChange={(e) => setSearchDocente(e.target.value)}
                className="pl-10"
                style={{ borderRadius: "8px" }}
              />
            </div>

            {/* Filtro de semestre */}
            <Select
              value={selectedSemestre}
              onValueChange={setSelectedSemestre}
            >
              <SelectTrigger
                className="w-full md:w-[180px]"
                style={{ borderRadius: "8px" }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025-1">Semestre 2025-1</SelectItem>
                <SelectItem value="2024-2">Semestre 2024-2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Contador de asignaciones para debug */}
        {asignaciones.length > 0 && (
          <p className="text-sm text-gray-500 mb-3">
            Total: {asignaciones.length} asignaciones | Mostrando:{" "}
            {asignacionesFiltradas.length}
          </p>
        )}

        <ScrollArea className="h-[500px]">
          <div className="space-y-3 pr-4">
            {asignacionesFiltradas.map((asignacion) => (
              <AsignacionCard
                key={asignacion.id_asignacion}
                asignacion={asignacion}
              />
            ))}

            {asignacionesFiltradas.length === 0 && asignaciones.length > 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  No se encontraron asignaciones para los filtros aplicados
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Semestre: {selectedSemestre}
                  {searchDocente && ` | Docente: ${searchDocente}`}
                </p>
              </div>
            )}

            {asignaciones.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No hay asignaciones registradas</p>
                <p className="text-gray-400 text-sm mt-2">
                  Crea tu primera asignación usando el formulario de arriba
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <ToastContainer />
      <EditAsignacion />
      <DeleteAsignacion />
    </div>
  );
}

export default Asignaciones;

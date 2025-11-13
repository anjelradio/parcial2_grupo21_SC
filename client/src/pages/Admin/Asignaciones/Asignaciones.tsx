import { useState, useEffect } from "react";
import { BookOpen, Search, ChevronLeft, ChevronRight } from "lucide-react";
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
import EditAsignacion from "./EditAsignacion";
import DeleteAsignacion from "./DeleteAsignacion";

import { useAppStore } from "../../../stores/useAppStore";
import { ToastContainer } from "react-toastify";

function Asignaciones() {
  const {
    asignaciones,
    asignacionesPaginacion,
    fetchAsignaciones,
    fetchUsers,
    fetchMaterias,
    fetchGrupos,
    fetchDias,
    fetchBloquesHorarios,
    fetchAulas,
    fetchGestiones,
    hasLoadedAsignaciones,
    hasLoadedAulas,
    hasLoadedUsers,
    hasLoadedGrupos,
    hasLoadedBloquesHorarios,
    hasLoadedMaterias,
    hasLoadedDias,
    hasLoadedGestiones,
    gestiones,
    setGlobalLoading,
  } = useAppStore();

  // === ESTADOS ===
  const [searchDocente, setSearchDocente] = useState("");
  const [semestreFilter, setSemestreFilter] = useState("actual");
  const [currentPage, setCurrentPage] = useState(1);

  // === CARGA INICIAL ===
  useEffect(() => {
    const cargar = async () => {
      if (
        !hasLoadedAulas ||
        !hasLoadedGrupos ||
        !hasLoadedMaterias ||
        !hasLoadedBloquesHorarios ||
        !hasLoadedDias ||
        !hasLoadedUsers ||
        !hasLoadedAsignaciones ||
        !hasLoadedGestiones
      ) {
        setGlobalLoading(true);
      }

      await Promise.all([
        fetchAulas(),
        fetchGrupos(),
        fetchMaterias(),
        fetchBloquesHorarios(),
        fetchDias(),
        fetchUsers(),
        fetchGestiones(),
        fetchAsignaciones(),
      ]);

      setGlobalLoading(false);
    };
    cargar();
  }, []);

  // === BÚSQUEDA POR ENTER ===
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleApplyFilters(1);
  };

  // === APLICAR FILTROS ===
  const handleApplyFilters = async (page = 1) => {
    const params: any = {
      page,
      page_size: 6,
      nombre_docente: searchDocente.trim() || undefined,
    };

    // Si NO es "todos" ni "actual", es una gestión seleccionada
    if (semestreFilter !== "todos" && semestreFilter !== "actual") {
      params.id_gestion = Number(semestreFilter);
    }

    await fetchAsignaciones(params);
    setCurrentPage(page);
  };

  // === TOTAL DE PÁGINAS DEL BACKEND ===
  const totalPages = asignacionesPaginacion?.total_paginas || 1;

  // === RANGO DINÁMICO DE PÁGINAS ===
  const visiblePages = 3;
  const half = Math.floor(visiblePages / 2);

  let startPage = Math.max(1, currentPage - half);
  let endPage = Math.min(totalPages, startPage + visiblePages - 1);

  if (endPage - startPage < visiblePages - 1) {
    startPage = Math.max(1, endPage - visiblePages + 1);
  }

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div className="space-y-8">
      {/* ENCABEZADO */}
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Gestión de Asignaciones</h1>
        <p className="text-gray-600">Asigna docentes, materias, grupos y aulas</p>
      </div>

      {/* FORM NUEVA ASIGNACIÓN */}
      <AddAsignacion />

      {/* CONTENEDOR PRINCIPAL */}
      <div className="bg-white p-6 shadow-lg border border-gray-100 rounded-lg">
        {/* === FILTROS === */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          {/* BUSCAR DOCENTE */}
          <div className="relative flex-1 md:min-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por docente..."
              value={searchDocente}
              onChange={(e) => setSearchDocente(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="pl-10 rounded-md"
            />
          </div>

          {/* SELECT GESTIÓN */}
          <Select value={semestreFilter} onValueChange={setSemestreFilter}>
            <SelectTrigger className="w-full md:w-[200px] rounded-md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="actual">Gestión actual</SelectItem>
              <SelectItem value="todos">Todas</SelectItem>
              {gestiones.map((g) => (
                <SelectItem key={g.id_gestion} value={String(g.id_gestion)}>
                  {g.descripcion}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* APLICAR */}
          <button
            onClick={() => handleApplyFilters(1)}
            className="px-4 py-2 bg-[#226c8f] text-white rounded-md hover:bg-[#1a5469]"
          >
            Aplicar
          </button>
        </div>

        {/* === LISTA DE ASIGNACIONES === */}
        <ScrollArea className="h-[500px]">
          <div className="space-y-3 pr-4">
            {asignaciones.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No hay asignaciones</p>
              </div>
            ) : (
              asignaciones.map((asignacion) => (
                <AsignacionCard
                  key={asignacion.id_asignacion}
                  asignacion={asignacion}
                />
              ))
            )}
          </div>
        </ScrollArea>

        {/* === PAGINACIÓN === */}
        <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t">
          {/* PREV */}
          <button
            onClick={() => handleApplyFilters(Math.max(1, currentPage - 1))}
            disabled={!asignacionesPaginacion?.tiene_anterior}
            className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-40 rounded-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* PÁGINAS DINÁMICAS */}
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => handleApplyFilters(page)}
              className={`px-3 py-1.5 min-w-[36px] rounded-md transition-colors ${
                currentPage === page
                  ? "bg-[#226c8f] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          {/* NEXT */}
          <button
            onClick={() =>
              handleApplyFilters(
                Math.min(totalPages, currentPage + 1)
              )
            }
            disabled={!asignacionesPaginacion?.tiene_siguiente}
            className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-40 rounded-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <ToastContainer />
      <EditAsignacion />
      <DeleteAsignacion />
    </div>
  );
}

export default Asignaciones;

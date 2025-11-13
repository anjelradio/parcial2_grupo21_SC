import { useEffect, useState } from "react";
import { ScrollArea } from "../../../../../components/ui/scroll-area";
import { Input } from "../../../../../components/ui/input";
import {
  BookOpen,
  FileText,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAppStore } from "../../../../../stores/useAppStore";

function GruposMateriasList() {
  const {
    gruposMateriasGestion,
    gruposGestionPaginacion,
    isLoadingGrupos,
    fetchGruposMateriasGestion,
    selectedGestionId,
  } = useAppStore();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // === Cargar grupos al inicio ===
  useEffect(() => {
    if (selectedGestionId) {
      fetchGruposMateriasGestion({ page: 1, page_size: 10 });
      setCurrentPage(1);
    }
  }, [selectedGestionId]);

  // === Búsqueda con Enter ===
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handlePageChange(1);
    }
  };

  // === Función de paginación ===
  const handlePageChange = async (page: number) => {
    if (page < 1 || page > totalPages) return;
    await fetchGruposMateriasGestion({
      page,
      page_size: 10,
      search: search.trim() || undefined,
    });
    setCurrentPage(page);
  };

  const totalPages = gruposGestionPaginacion?.total_paginas || 1;

  // === Generar rango visible de páginas (máx 3 botones) ===
  const visiblePages = 3;
  const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
  const endPage = Math.min(totalPages, startPage + visiblePages - 1);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const handleGenerarReporte = () => {
    if (!selectedGestionId) return;

    const url = `${
      import.meta.env.VITE_API_BASE_URL
    }/consulta-gestion/${selectedGestionId}/grupos/reporte?tipo=pdf`;
    window.open(url, "_blank"); 
  };

  return (
    <div className="bg-white p-6 shadow-lg border border-gray-100 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-[#226c8f] rounded-sm"></div>
          <h3 className="text-gray-900">Grupos y Materias</h3>
        </div>
        <button onClick={handleGenerarReporte}
        className="px-3 py-2 bg-[#226c8f] text-white hover:bg-[#1a5469] transition-all duration-300 text-sm flex items-center gap-2 rounded-md">
          <FileText className="w-4 h-4" />
          Generar Reporte
        </button>
      </div>

      {/* Filtro de búsqueda */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Buscar materia o grupo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          className="pl-10"
          style={{ borderRadius: "8px" }}
        />
      </div>

      {/* Listado */}
      <ScrollArea className="h-[450px]">
        <div className="space-y-3 pr-4">
          {isLoadingGrupos ? (
            <div className="text-center text-gray-500 py-10">
              Cargando grupos...
            </div>
          ) : gruposMateriasGestion.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No se encontraron grupos ni materias
            </div>
          ) : (
            gruposMateriasGestion.map((grupo) => (
              <div
                key={grupo.id_grupo}
                className="bg-gray-50 p-4 border border-gray-200 hover:border-[#226c8f] transition-all duration-300 rounded-md"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-md">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">
                      {grupo.nombre_materia}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-1 bg-[#226c8f]/10 text-[#226c8f] rounded-md">
                        {grupo.sigla_materia}
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-md">
                        Grupo {grupo.nombre_grupo}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Paginación */}
      <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-200">
        {/* Botón anterior */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!gruposGestionPaginacion?.tiene_anterior}
          className="p-2 text-gray-600 hover:text-[#226c8f] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-md"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Botones visibles */}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1.5 min-w-[36px] rounded-md transition-all ${
              currentPage === page
                ? "bg-[#226c8f] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Botón siguiente */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!gruposGestionPaginacion?.tiene_siguiente}
          className="p-2 text-gray-600 hover:text-[#226c8f] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-md"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default GruposMateriasList;

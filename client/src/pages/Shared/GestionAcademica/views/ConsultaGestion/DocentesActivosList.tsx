import { useEffect, useState } from "react";
import {
  FileText,
  Search,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "../../../../../components/ui/input";
import { ScrollArea } from "../../../../../components/ui/scroll-area";
import { useAppStore } from "../../../../../stores/useAppStore";

function DocentesActivosList() {
  const {
    docentesGestion,
    docentesGestionPaginacion,
    isLoadingDocentes,
    fetchDocentesGestion,
    selectedGestionId,
  } = useAppStore();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // === Cargar la primera página cuando cambie la gestión ===
  useEffect(() => {
    if (selectedGestionId) {
      handlePageChange(1);
    }
  }, [selectedGestionId]);

  // === Búsqueda al presionar Enter ===
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handlePageChange(1);
    }
  };

  // === Función para cambiar página y hacer el fetch ===
  const handlePageChange = async (page: number) => {
    console.log(page);
    await fetchDocentesGestion({
      page,
      page_size: 10,
      nombre_docente: search.trim() || undefined,
    });

    setCurrentPage(page);
  };

  // === Total de páginas ===
  const totalPages = docentesGestionPaginacion?.total_paginas || 1;

  // === Control de rango dinámico de botones de página ===
  const visiblePages = 3; // ← Solo mostramos 3 botones a la vez
  const halfRange = Math.floor(visiblePages / 2);
  let startPage = Math.max(1, currentPage - halfRange);
  let endPage = Math.min(totalPages, startPage + visiblePages - 1);

  // Ajuste si estamos al final
  if (endPage - startPage < visiblePages - 1) {
    startPage = Math.max(1, endPage - visiblePages + 1);
  }

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  const handleGenerarReporte = () => {
    if (!selectedGestionId) return;

    const url = `${
      import.meta.env.VITE_API_BASE_URL
    }/consulta-gestion/${selectedGestionId}/docentes/reporte?tipo=pdf`;
    window.open(url, "_blank");
  };

  return (
    <div className="bg-white p-6 shadow-lg border border-gray-100 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-[#226c8f] rounded-sm"></div>
          <h3 className="text-gray-900">Docentes Activos</h3>
        </div>
        <button 
        onClick={handleGenerarReporte}
        className="px-3 py-2 bg-[#226c8f] text-white hover:bg-[#1a5469] transition-all duration-300 text-sm flex items-center gap-2 rounded-md">
          <FileText className="w-4 h-4" />
          Generar Reporte
        </button>
      </div>

      {/* Filtro de búsqueda */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Buscar docente por nombre..."
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
          {isLoadingDocentes ? (
            <div className="text-center text-gray-500 py-10">
              Cargando docentes...
            </div>
          ) : docentesGestion.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No se encontraron docentes
            </div>
          ) : (
            docentesGestion.map((docente) => (
              <div
                key={docente.user_id}
                className="bg-gray-50 p-4 border border-gray-200 hover:border-[#226c8f] transition-all duration-300 rounded-md"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#226c8f]/10 rounded-md">
                    <User className="w-5 h-5 text-[#226c8f]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">
                      {docente.nombre_completo}
                    </p>
                    <p className="text-sm text-gray-600">{docente.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {docente.profesion}
                    </p>
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
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={!docentesGestionPaginacion?.tiene_anterior}
          className="p-2 text-gray-600 hover:text-[#226c8f] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-md"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Botones de páginas visibles */}
        {pageNumbers.map((page) => (
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
          onClick={() =>
            handlePageChange(Math.min(totalPages, currentPage + 1))
          }
          disabled={!docentesGestionPaginacion?.tiene_siguiente}
          className="p-2 text-gray-600 hover:text-[#226c8f] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-md"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default DocentesActivosList;

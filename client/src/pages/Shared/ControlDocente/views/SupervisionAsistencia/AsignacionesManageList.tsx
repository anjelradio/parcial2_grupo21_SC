import { useEffect, useState, useMemo } from "react";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  AlertCircle,
} from "lucide-react";

import { Input } from "../../../../../components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "../../../../../components/ui/select";

import { Badge } from "../../../../../components/ui/badge";
import { ScrollArea } from "../../../../../components/ui/scroll-area";

import { useAppStore } from "../../../../../stores/useAppStore";

function AsignacionesManageList() {
  const {
    asignaciones,
    asignacionesPaginacion,
    asignacionesFiltros,
    setModal,
    fetchAsignaciones,
    gestiones,
    selectAsignacionSup,
  } = useAppStore();

  const [searchDocente, setSearchDocente] = useState("");
  const [semestreFilter, setSemestreFilter] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);

  // === Cuando cambie el filtro, recargar desde página 1 ===
  useEffect(() => {
    handlePageChange(1);
  }, [semestreFilter]);

  // === Filtros y fetch ===
  const handlePageChange = async (page: number) => {
    const params: any = {
      page,
      page_size: 6,
      nombre_docente: searchDocente.trim() || undefined,
    };

    if (semestreFilter !== "todos") {
      params.id_gestion = Number(semestreFilter);
    }

    await fetchAsignaciones(params);
    setCurrentPage(page);
  };

  // === Enter para búsqueda ===
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handlePageChange(1);
  };

  const totalPages = asignacionesPaginacion?.total_paginas || 1;

  // === Rango dinámico de paginación (solo 3 botones visibles) ===
  const visiblePages = 3;
  const halfRange = Math.floor(visiblePages / 2);

  let startPage = Math.max(1, currentPage - halfRange);
  let endPage = Math.min(totalPages, startPage + visiblePages - 1);

  if (endPage - startPage < visiblePages - 1) {
    startPage = Math.max(1, endPage - visiblePages + 1);
  }

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  const handleClick = (id: number) => {
    selectAsignacionSup(id);
    setModal("asistenciasModal", true);
  };
  return (
    <>
      {/* Filtros */}
      <div
        className="bg-white p-4 shadow-lg border border-gray-100 mb-4"
        style={{ borderRadius: "8px" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por docente..."
              value={searchDocente}
              onChange={(e) => setSearchDocente(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="pl-10"
              style={{ borderRadius: "8px" }}
            />
          </div>

          {/* Filtro de semestre */}
          <Select
            value={semestreFilter}
            onValueChange={(v) => setSemestreFilter(v)}
          >
            <SelectTrigger style={{ borderRadius: "8px" }}>
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Semestre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Vigente</SelectItem>
              {gestiones.map((g) => (
                <SelectItem key={g.id_gestion} value={String(g.id_gestion)}>
                  {g.descripcion}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Listado principal */}
      <div
        className="bg-white shadow-lg border border-gray-100 flex flex-col"
        style={{ borderRadius: "8px", height: "600px" }}
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-2">
            <div
              className="w-1 h-6 bg-[#226c8f]"
              style={{ borderRadius: "2px" }}
            ></div>
            <h3 className="text-gray-900">Listado de Asignaciones</h3>
            <span className="text-sm text-gray-500 ml-auto">
              Total: {asignaciones.length}
            </span>
          </div>
        </div>

        {/* Contenido scrollable */}
        <ScrollArea className="flex-1 px-6 pb-4">
          {asignaciones.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {asignaciones.map((a) => {
                const docente = a.docente?.nombre_completo ?? "Sin docente";
                const materia =
                  a.grupo?.materia?.nombre ?? "Materia desconocida";
                const grupo = a.grupo?.nombre ?? "S/G";
                const semestre = a.gestion?.nombre_gestion ?? "S/G";

                return (
                  <div
                    key={a.id_asignacion}
                    className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 border-2 border-transparent hover:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-md"
                    style={{ borderRadius: "8px" }}
                    onClick={() => handleClick(a.id_asignacion)}
                  >
                    <div className="space-y-3">
                      {/* Materia + porcentaje */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="p-2 bg-blue-500/20"
                            style={{ borderRadius: "6px" }}
                          >
                            <ClipboardList className="w-4 h-4 text-blue-700" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Materia</p>
                            <p className="text-gray-900 truncate">{materia}</p>
                          </div>
                        </div>

                        <Badge className="bg-green-600 text-white">
                          {a.estado}
                        </Badge>
                      </div>

                      {/* Info general */}
                      <div className="grid grid-cols-2 gap-2">
                        <div
                          className="bg-white/50 p-2"
                          style={{ borderRadius: "6px" }}
                        >
                          <p className="text-xs text-gray-600">Docente</p>
                          <p className="text-gray-900 text-xs truncate">
                            {docente}
                          </p>
                        </div>

                        <div
                          className="bg-white/50 p-2"
                          style={{ borderRadius: "6px" }}
                        >
                          <p className="text-xs text-gray-600">Grupo</p>
                          <p className="text-gray-900 text-xs">{grupo}</p>
                        </div>
                      </div>

                      <div
                        className="bg-white/40 p-2"
                        style={{ borderRadius: "6px" }}
                      >
                        <p className="text-xs text-gray-600 mb-1">
                          Semestre {semestre}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px]">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No se encontraron asignaciones</p>
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Paginación */}
        <div
          className="border-t border-gray-100 p-4 bg-gray-50"
          style={{
            borderBottomLeftRadius: "8px",
            borderBottomRightRadius: "8px",
          }}
        >
          <div className="flex items-center justify-center gap-2">
            {/* Anterior */}
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={!asignacionesPaginacion?.tiene_anterior}
              className="p-2 text-gray-600 hover:text-[#226c8f] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed rounded-md"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* 3 botones dinámicos */}
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

            {/* Siguiente */}
            <button
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={!asignacionesPaginacion?.tiene_siguiente}
              className="p-2 text-gray-600 hover:text-[#226c8f] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed rounded-md"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AsignacionesManageList;

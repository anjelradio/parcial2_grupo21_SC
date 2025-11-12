import { useState, useEffect } from "react";
import { Input } from "../../../../../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../../../../components/ui/select";
import {
  Building2,
  Search,
  Calendar,
  UserCircle2,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Badge } from "../../../../../components/ui/badge";
import { useAppStore } from "../../../../../stores/useAppStore";

function SolicitudesManageList() {
  const {
    semestres,
    solicitudesAula,
    solicitudesPaginacion,
    fetchSolicitudesAula,
    selectSolicitud,
    setModal,
  } = useAppStore();

  // Estados locales de filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("todos");
  const [fechaFilter, setFechaFilter] = useState("");
  const [semestreFilter, setSemestreFilter] = useState("actual");
  const [currentPage, setCurrentPage] = useState(1);

  // Cargar solicitudes iniciales
  useEffect(() => {
    handleApplyFilters(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Función para aplicar filtros y traer datos del backend
  const handleApplyFilters = async (page = 1) => {
    const params: any = {
      page,
      page_size: 9,
      nombre_docente: searchTerm || undefined,
      fecha: fechaFilter || undefined,
    };

    if (semestreFilter !== "todos" && semestreFilter !== "actual") {
      params.id_gestion = Number(semestreFilter);
    }

    await fetchSolicitudesAula(params);
    setCurrentPage(page);
  };

  // ==============================
  //   Helpers de renderizado
  // ==============================

  const getEstadoBadge = (estado: string) => {
    const lower = estado.toLowerCase();
    const badgeClass = {
      aprobado: "bg-green-600",
      aprobada: "bg-green-600",
      rechazado: "bg-red-600",
      rechazada: "bg-red-600",
      pendiente: "bg-yellow-600",
    }[lower];

    return (
      <Badge
        className={`${badgeClass || "bg-gray-600"} text-white`}
        style={{ borderRadius: "4px" }}
      >
        {estado}
      </Badge>
    );
  };

  const handleClick = (id: number) => {
    selectSolicitud(id);
    setModal("solicitudDetail", true);
  };

  // ==============================
  //   Filtros en memoria (estado)
  // ==============================

  const filteredSolicitudes = solicitudesAula.filter((s) => {
    const matchesEstado =
      estadoFilter === "todos" ||
      s.estado.toLowerCase() === estadoFilter.toLowerCase();
    return matchesEstado;
  });

  const totalPages = solicitudesPaginacion?.total_paginas || 1;

  // ==============================
  //   Render principal
  // ==============================

  return (
    <>
      {/* ======= FILTROS ======= */}
      <div
        className="bg-white p-4 shadow-lg border border-gray-100"
        style={{ borderRadius: "8px" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Buscar docente */}
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por docente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                style={{ borderRadius: "8px" }}
              />
            </div>
          </div>

          {/* Estado */}
          <div>
            <Select value={estadoFilter} onValueChange={setEstadoFilter}>
              <SelectTrigger style={{ borderRadius: "8px" }}>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="Pendiente">Pendientes</SelectItem>
                <SelectItem value="Aprobada">Aprobadas</SelectItem>
                <SelectItem value="Rechazada">Rechazadas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="date"
                placeholder="Fecha..."
                value={fechaFilter}
                onChange={(e) => setFechaFilter(e.target.value)}
                className="pl-10"
                style={{ borderRadius: "8px" }}
              />
            </div>
          </div>
          {/* Semestre */}
          <div>
            <Select value={semestreFilter} onValueChange={setSemestreFilter}>
              <SelectTrigger style={{ borderRadius: "8px" }}>
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Semestre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {semestres.map((sem) => (
                  <SelectItem
                    key={sem.id_gestion}
                    value={String(sem.id_gestion)}
                  >
                    {sem.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Botón de filtros */}
        <div className="flex justify-end mt-4">
          <button
            onClick={() => handleApplyFilters()}
            className="bg-[#226c8f] text-white px-4 py-2 text-sm hover:bg-[#1b5773] transition-all rounded-md"
          >
            Aplicar filtros
          </button>
        </div>
      </div>

      {/* ======= LISTADO ======= */}
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
            <h3 className="text-gray-900">Listado de Solicitudes</h3>
            <span className="text-sm text-gray-500 ml-auto">
              Mostrando {filteredSolicitudes.length} resultados
            </span>
          </div>
        </div>

        {/* Contenedor scrollable */}
        <div className="flex-1 overflow-y-auto px-6">
          {filteredSolicitudes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
              {filteredSolicitudes.map((solicitud) => (
                <div
                  key={solicitud.id_solicitud}
                  onClick={() => handleClick(solicitud.id_solicitud)}
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 border-2 border-transparent hover:border-blue-400 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md"
                  style={{ borderRadius: "8px" }}
                >
                  <div className="space-y-3">
                    {/* Docente + estado */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="p-2 bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors"
                          style={{ borderRadius: "6px" }}
                        >
                          <UserCircle2 className="w-4 h-4 text-blue-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-600">Docente</p>
                          <p className="text-gray-900 truncate">
                            {solicitud.nombre_docente || "—"}
                          </p>
                        </div>
                      </div>
                      {getEstadoBadge(solicitud.estado)}
                    </div>

                    {/* Aula y fecha */}
                    <div className="grid grid-cols-2 gap-2">
                      <div
                        className="bg-white/50 p-2"
                        style={{ borderRadius: "6px" }}
                      >
                        <p className="text-xs text-gray-600">Aula</p>
                        <p className="text-gray-900 text-xs">
                          Aula {solicitud.nro_aula || "—"}
                        </p>
                      </div>
                      <div
                        className="bg-white/50 p-2"
                        style={{ borderRadius: "6px" }}
                      >
                        <p className="text-xs text-gray-600">Fecha</p>
                        <p className="text-gray-900 text-xs">
                          {solicitud.fecha_solicitada || "—"}
                        </p>
                      </div>
                    </div>

                    {/* Motivo */}
                    <div
                      className="bg-white/40 p-2"
                      style={{ borderRadius: "6px" }}
                    >
                      <p className="text-xs text-gray-600 mb-1">Motivo</p>
                      <p className="text-gray-700 text-xs line-clamp-2">
                        {solicitud.motivo || "Sin motivo"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No se encontraron solicitudes</p>
              </div>
            </div>
          )}
        </div>

        {/* ======= FOOTER PAGINACIÓN ======= */}
        <div
          className="border-t border-gray-100 p-4 bg-gray-50"
          style={{
            borderBottomLeftRadius: "8px",
            borderBottomRightRadius: "8px",
          }}
        >
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handleApplyFilters(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-600 hover:text-[#226c8f] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              style={{ borderRadius: "6px" }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handleApplyFilters(page)}
                className={`px-3 py-1.5 min-w-[36px] transition-all duration-200 ${
                  currentPage === page
                    ? "bg-[#226c8f] text-white shadow-sm"
                    : "text-gray-600 hover:bg-white"
                }`}
                style={{ borderRadius: "6px" }}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                handleApplyFilters(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="p-2 text-gray-600 hover:text-[#226c8f] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              style={{ borderRadius: "6px" }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SolicitudesManageList;

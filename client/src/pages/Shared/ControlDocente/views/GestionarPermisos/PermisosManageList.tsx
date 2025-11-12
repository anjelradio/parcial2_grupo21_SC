import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  AlertCircle,
  UserCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "../../../../../components/ui/input";
import { Badge } from "../../../../../components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../../../components/ui/select";
import { useAppStore } from "../../../../../stores/useAppStore";

function PermisosManageList() {
  const {
    fetchPermisosDocente,
    permisosDocente,
    permisosPaginacion,
    isLoadingPermisos,
    semestres,
    setModal,
    selectPermiso,
  } = useAppStore();

  // Estados locales de filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("todos");
  const [fechaFilter, setFechaFilter] = useState("");
  const [semestreFilter, setSemestreFilter] = useState("actual");
  const [currentPage, setCurrentPage] = useState(1);

  // Cargar la primera página al montar
  useEffect(() => {
    fetchPermisosDocente({ page: 1, page_size: 15 });
  }, [fetchPermisosDocente]);

  // Función para aplicar filtros (llama al backend)
  const handleApplyFilters = async (page = 1) => {
    const params: any = {
      page,
      page_size: 9,
      nombre_docente: searchTerm || undefined,
      fecha: fechaFilter || undefined,
    };

    // Si el usuario selecciona un semestre específico
    if (semestreFilter !== "todos" && semestreFilter !== "actual") {
      params.id_gestion = Number(semestreFilter);
    }

    await fetchPermisosDocente(params);
    setCurrentPage(page);
  };

  // Paginación
  const totalPages = permisosPaginacion?.total_paginas || 1;

  const filteredPermisos = permisosDocente.filter((permiso) => {
    const matchesEstado =
      estadoFilter === "todos" || permiso.estado === estadoFilter;

    return matchesEstado;
  });
  const getEstadoBadge = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "aprobado":
        return (
          <Badge
            className="bg-green-600 text-white"
            style={{ borderRadius: "4px" }}
          >
            Aprobado
          </Badge>
        );
      case "rechazado":
        return (
          <Badge
            className="bg-red-600 text-white"
            style={{ borderRadius: "4px" }}
          >
            Rechazado
          </Badge>
        );
      case "pendiente":
        return (
          <Badge
            className="bg-yellow-600 text-white"
            style={{ borderRadius: "4px" }}
          >
            Pendiente
          </Badge>
        );
      default:
        return (
          <Badge
            className="bg-gray-600 text-white"
            style={{ borderRadius: "4px" }}
          >
            {estado}
          </Badge>
        );
    }
  };

  const handleClick = (id: number) => {
    selectPermiso(id);
    setModal("permisoDetail", true);
  };

  return (
    <>
      {/* ================== FILTROS ================== */}
      <div
        className="bg-white p-4 shadow-lg border border-gray-100"
        style={{ borderRadius: "8px" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por docente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
                className="pl-10"
                style={{ borderRadius: "8px" }}
              />
            </div>
          </div>

          <div>
            <Select value={estadoFilter} onValueChange={setEstadoFilter}>
              <SelectTrigger style={{ borderRadius: "8px" }}>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="Pendiente">Pendientes</SelectItem>
                <SelectItem value="Aprobado">Aprobados</SelectItem>
                <SelectItem value="Rechazado">Rechazados</SelectItem>
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

        <div className="flex justify-end mt-4">
          <button
            onClick={() => handleApplyFilters()}
            className="bg-[#226c8f] text-white px-4 py-2 text-sm hover:bg-[#1b5773] transition-all rounded-md"
          >
            Aplicar filtros
          </button>
        </div>
      </div>

      {/* ================== LISTADO ================== */}
      <div
        className="bg-white shadow-lg border border-gray-100 flex flex-col"
        style={{ borderRadius: "8px", height: "600px" }}
      >
        <div className="p-6 pb-4">
          <div className="flex items-center gap-2">
            <div
              className="w-1 h-6 bg-[#226c8f]"
              style={{ borderRadius: "2px" }}
            ></div>
            <h3 className="text-gray-900">Listado de Permisos</h3>
            <span className="text-sm text-gray-500 ml-auto">
              Página {permisosPaginacion.pagina_actual} de{" "}
              {permisosPaginacion.total_paginas}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {isLoadingPermisos ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              Cargando permisos...
            </div>
          ) : filteredPermisos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
              {filteredPermisos.map((permiso) => (
                <div
                  key={permiso.id_permiso}
                  className="bg-gradient-to-br from-amber-50 to-yellow-50 p-4 border-2 border-transparent hover:border-yellow-400 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md"
                  style={{ borderRadius: "8px" }}
                  onClick={() => handleClick(permiso.id_permiso)}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="p-2 bg-yellow-500/20 group-hover:bg-yellow-500/30 transition-colors"
                          style={{ borderRadius: "6px" }}
                        >
                          <UserCircle2 className="w-4 h-4 text-yellow-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-600">Docente</p>
                          <p className="text-gray-900 truncate">
                            {permiso.nombre_docente}
                          </p>
                        </div>
                      </div>
                      {getEstadoBadge(permiso.estado)}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white/50 p-2 rounded-md">
                        <p className="text-xs text-gray-600">Inicio</p>
                        <p className="text-gray-900 text-xs">
                          {permiso.fecha_inicio}
                        </p>
                      </div>
                      <div className="bg-white/50 p-2 rounded-md">
                        <p className="text-xs text-gray-600">Fin</p>
                        <p className="text-gray-900 text-xs">
                          {permiso.fecha_fin}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/40 p-2 rounded-md">
                      <p className="text-xs text-gray-600 mb-1">Motivo</p>
                      <p className="text-gray-700 text-xs line-clamp-2">
                        {permiso.motivo}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No se encontraron permisos</p>
              </div>
            </div>
          )}
        </div>

        {/* ================== PAGINACIÓN ================== */}
        <div
          className="border-t border-gray-100 p-4 bg-gray-50 flex justify-center gap-2"
          style={{
            borderBottomLeftRadius: "8px",
            borderBottomRightRadius: "8px",
          }}
        >
          <button
            onClick={() => handleApplyFilters(Math.max(1, currentPage - 1))}
            disabled={!permisosPaginacion.tiene_anterior}
            className="p-2 text-gray-600 hover:text-[#226c8f] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {Array.from(
            { length: permisosPaginacion.total_paginas || 1 },
            (_, i) => i + 1
          ).map((page) => (
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
            disabled={!permisosPaginacion.tiene_siguiente}
            className="p-2 text-gray-600 hover:text-[#226c8f] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
}

export default PermisosManageList;

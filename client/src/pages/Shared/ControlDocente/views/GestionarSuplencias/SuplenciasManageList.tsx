import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  UserCheck,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "../../../../../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "../../../../../components/ui/select";
import { Badge } from "../../../../../components/ui/badge";
import { useAppStore } from "../../../../../stores/useAppStore";

function SuplenciasManageList() {
  const {
    fetchSuplencias,
    hasLoadedSuplencias,
    setGlobalLoading,
    suplenciasPaginacion,
    suplencias,
    semestres,
    isLoadingSuplencias,
    selectSuplencia,
    setModal
  } = useAppStore();

  // Estados locales de filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("todos");
  const [semestreFilter, setSemestreFilter] = useState("actual");
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    const cargar = async () => {
      if (!hasLoadedSuplencias) {
        console.log('ola?')
        setGlobalLoading(true);
        await Promise.all([fetchSuplencias({ page: 1, page_size: 9 })]);
        setGlobalLoading(false);
      }
    };
    cargar()

  }, [fetchSuplencias, setGlobalLoading, hasLoadedSuplencias]);

  // Función para aplicar filtros (llama al backend)
  const handleApplyFilters = async (page = 1) => {
    const params: any = {
      page,
      page_size: 9,
      nombre_titular: searchTerm || undefined,
    };

    // Si el usuario selecciona un semestre específico
    if (semestreFilter !== "todos" && semestreFilter !== "actual") {
      params.id_gestion = Number(semestreFilter);
    }

    await fetchSuplencias(params);
    setCurrentPage(page);
  };

  // ==============================
  //   Filtros en memoria (estado)
  // ==============================
  const totalPages = suplenciasPaginacion?.total_paginas || 1;

  const filteredSuplencias = suplencias.filter((suplencia) => {
    const matchesEstado =
      estadoFilter === "todos" || suplencia.estado === estadoFilter;

    return matchesEstado;
  });

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Activa":
        return (
          <Badge
            className="bg-green-600 text-white"
            style={{ borderRadius: "4px" }}
          >
            Activa
          </Badge>
        );
      case "Finalizada":
        return (
          <Badge
            className="bg-gray-600 text-white"
            style={{ borderRadius: "4px" }}
          >
            Finalizada
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

  const handleEdit = (id: number) => {
     selectSuplencia(id);
     setModal("editSuplencia", true);
  };

  const handleDelete = (id: number) => {
    selectSuplencia(id);
     setModal("deleteSuplencia", true);
  };
  useEffect(() => {
    console.log("📄 Página actual:", currentPage);
  }, [currentPage]);

  return (
    <>
      {/* ================== FILTROS ================== */}
      <div
        className="bg-white p-4 shadow-lg border border-gray-100"
        style={{ borderRadius: "8px" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por docente titular..."
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
                <SelectItem value="Activa">Activa</SelectItem>
                <SelectItem value="Finalizada">Finalizada</SelectItem>
              </SelectContent>
            </Select>
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
        {/* Header del listado */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-2">
            <div
              className="w-1 h-6 bg-[#226c8f]"
              style={{ borderRadius: "2px" }}
            ></div>
            <h3 className="text-gray-900">Suplencias Registradas</h3>
            <span className="text-sm text-gray-500 ml-auto">
              Página {suplenciasPaginacion.pagina_actual} de{" "}
              {suplenciasPaginacion.total_paginas}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {isLoadingSuplencias ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              Cargando suplencias...
            </div>
          ) : filteredSuplencias.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
              {filteredSuplencias.map((suplencia) => (
                <div
                  key={suplencia.id_suplencia}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 border-2 border-transparent hover:border-green-400 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md relative"
                  style={{ borderRadius: "8px" }}
                >
                  {/* Ícono de fondo decorativo */}
                  <div className="absolute right-2 bottom-2 opacity-[0.05] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                    <UserCheck className="w-20 h-20 text-green-600" />
                  </div>

                  <div className="relative z-10 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="p-2 bg-green-500/20 group-hover:bg-green-500/30 transition-colors"
                          style={{ borderRadius: "6px" }}
                        >
                          <UserCheck className="w-4 h-4 text-green-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-600">Titular</p>
                          <p className="text-gray-900 truncate">
                            {suplencia.nombre_docente_titular}
                          </p>
                        </div>
                      </div>
                      {getEstadoBadge(suplencia.estado)}
                    </div>

                    <div
                      className="bg-white/50 p-2"
                      style={{ borderRadius: "6px" }}
                    >
                      <p className="text-xs text-gray-600">Suplente</p>
                      <p className="text-[#226c8f]">
                        {suplencia.nombre_docente_suplente}
                      </p>
                    </div>

                    <div
                      className="bg-white/50 p-2"
                      style={{ borderRadius: "6px" }}
                    >
                      <p className="text-xs text-gray-600 mb-1">
                        Materia y Grupo
                      </p>
                      <p className="text-gray-900 text-xs">
                        {suplencia.materia?.nombre ?? "Sin materia"} -{" "}
                        {suplencia.grupo?.nombre ?? "—"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div
                        className="bg-white/50 p-2"
                        style={{ borderRadius: "6px" }}
                      >
                        <p className="text-xs text-gray-600">Inicio</p>
                        <p className="text-gray-900 text-xs">
                          {suplencia.fecha_inicio}
                        </p>
                      </div>
                      <div
                        className="bg-white/50 p-2"
                        style={{ borderRadius: "6px" }}
                      >
                        <p className="text-xs text-gray-600">Fin</p>
                        <p className="text-gray-900 text-xs">
                          {suplencia.fecha_fin}
                        </p>
                      </div>
                    </div>

                    <div
                      className="bg-white/40 p-2"
                      style={{ borderRadius: "6px" }}
                    >
                      <p className="text-xs text-gray-600 mb-1">Motivo</p>
                      <p className="text-gray-700 text-xs line-clamp-2">
                        {suplencia.motivo}
                      </p>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-2 pt-2 border-t border-green-200/50">
                      <button
                        className="flex-1 p-2 text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-1"
                        style={{ borderRadius: "6px" }}
                        onClick={() => handleEdit(suplencia.id_suplencia)}
                      >
                        <Edit className="w-3 h-3" />
                        <span className="text-xs">Editar</span>
                      </button>
                      <button
                        className="flex-1 p-2 text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-1"
                        style={{ borderRadius: "6px" }}
                        onClick={() => handleDelete(suplencia.id_suplencia)}
                      >
                        <Trash2 className="w-3 h-3" />
                        <span className="text-xs">Eliminar</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No se encontraron suplencias</p>
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
            onClick={() =>
              handleApplyFilters(
                Math.max(1, suplenciasPaginacion.pagina_actual - 1)
              )
            }
            disabled={!suplenciasPaginacion.tiene_anterior}
            className="p-2 text-gray-600 hover:text-[#226c8f] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {Array.from(
            { length: suplenciasPaginacion.total_paginas || 1 },
            (_, i) => i + 1
          ).map((page) => (
            <button
              key={page}
              onClick={() => handleApplyFilters(page)}
              className={`px-3 py-1.5 min-w-[36px] transition-all duration-200 ${
                suplenciasPaginacion.pagina_actual === page
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
            disabled={!suplenciasPaginacion.tiene_siguiente}
            className="p-2 text-gray-600 hover:text-[#226c8f] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
}

export default SuplenciasManageList;

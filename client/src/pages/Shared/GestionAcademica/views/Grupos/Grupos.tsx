import { useState } from "react";
import { ArrowLeft, BookOpen, School, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../../../../stores/useAppStore";
import { ScrollArea } from "../../../../../components/ui/scroll-area";
import { Input } from "../../../../../components/ui/input";
import { Search } from "lucide-react";
import AddGrupoForm from "./AddGrupoForm";
import GrupoCard from "./GrupoCard";
import { ToastContainer } from "react-toastify";
import EditGrupo from "./Modals/EditGrupo";
import DeleteGrupo from "./Modals/DeleteGrupo";
function Grupos() {
  const { grupos } = useAppStore();
  const navigate = useNavigate();
  const [searchGrupos, setSearchGrupos] = useState("");
  return (
    <div className="space-y-8">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/gestion-academica")}
          className="p-2 hover:bg-gray-100 transition-colors"
          style={{ borderRadius: "8px" }}
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-gray-900 mb-2">Gestión de Grupos</h1>
          <p className="text-gray-600">Administra los grupos académicos</p>
        </div>
      </div>

      {/* Estadísticas de Grupos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className="bg-white p-6 shadow-lg border border-gray-100"
          style={{ borderRadius: "8px" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="p-3 bg-[#226c8f]/10"
              style={{ borderRadius: "8px" }}
            >
              <Users className="w-6 h-6 text-[#226c8f]" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Total Grupos</p>
              <p className="text-2xl text-[#226c8f]">{grupos.length}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">Grupos activos</p>
        </div>

        <div
          className="bg-white p-6 shadow-lg border border-gray-100"
          style={{ borderRadius: "8px" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="p-3 bg-green-500/10"
              style={{ borderRadius: "8px" }}
            >
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Materias con Grupos</p>
              <p className="text-2xl text-[#226c8f]">
                {new Set(grupos.map((g) => g.id_materia)).size}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500">Materias distribuidas</p>
        </div>

        <div
          className="bg-white p-6 shadow-lg border border-gray-100"
          style={{ borderRadius: "8px" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-blue-500/10" style={{ borderRadius: "8px" }}>
              <School className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Promedio</p>
              <p className="text-2xl text-[#226c8f]">
                {(
                  grupos.length / new Set(grupos.map((g) => g.id_materia)).size
                ).toFixed(1)}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500">Grupos por materia</p>
        </div>
      </div>
      {/* Formulario de Nuevo Grupo */}
      <AddGrupoForm />

      {/* Lista de Grupos */}
      <div
        className="bg-white shadow-lg border border-gray-100"
        style={{ borderRadius: "12px" }}
      >
        {/* Encabezado del Contenedor */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-2.5 bg-green-500/10"
              style={{ borderRadius: "8px" }}
            >
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-gray-900">Grupos Registrados</h3>
          </div>

          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Buscar por nombre de grupo o materia..."
              value={searchGrupos}
              onChange={(e) => setSearchGrupos(e.target.value)}
              className="pl-10"
              style={{ borderRadius: "8px" }}
            />
          </div>
        </div>

        {/* Lista Scrolleable de Grupos */}
        <ScrollArea className="h-[600px] p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {grupos
              .filter(
                (g) =>
                  g.nombre.toLowerCase().includes(searchGrupos.toLowerCase()) ||
                  g
                    .nombre_materia!.toLowerCase()
                    .includes(searchGrupos.toLowerCase()) ||
                  g
                    .sigla_materia!.toLowerCase()
                    .includes(searchGrupos.toLowerCase())
              )
              .map((grupo) => (
                <GrupoCard key={grupo.id_grupo} grupo={grupo} />
              ))}
          </div>
        </ScrollArea>
      </div>

      <ToastContainer />
      <EditGrupo />
      <DeleteGrupo />
    </div>
  );
}

export default Grupos;

import { useState } from "react";
import { ArrowLeft, BookOpen, School, Users, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddMateriaForm from "./AddMateriaForm";
import MateriaCard from "./MateriaCard";
import { Input } from "../../../../../components/ui/input";
import { useAppStore } from "../../../../../stores/useAppStore";
import { ToastContainer } from "react-toastify";
import EditMateria from "./Modals/EditMateria";
import DeleteMateria from "./Modals/DeleteMateria";
import { ScrollArea } from "../../../../../components/ui/scroll-area";

function Materias() {
  const { materias } = useAppStore();
  const navigate = useNavigate();
  const [searchMaterias, setSearchMaterias] = useState("");
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
          <h1 className="text-gray-900 mb-2">Gestión de Materias</h1>
          <p className="text-gray-600">Administra las materias del sistema</p>
        </div>
      </div>

      {/* Estadísticas de Materias */}
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
              <BookOpen className="w-6 h-6 text-[#226c8f]" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Total Materias</p>
              <p className="text-2xl text-[#226c8f]">{materias.length}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">Materias registradas</p>
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
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Con Grupos</p>
              <p className="text-2xl text-[#226c8f]">
                {/* {new Set(grupos.map((g) => g.materiaId)).size} */}0
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500">Materias con grupos activos</p>
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
              <p className="text-xs text-gray-600">Sin Grupos</p>
              <p className="text-2xl text-[#226c8f]">
                {/* {materias.length - new Set(grupos.map((g) => g.materiaId)).size} */}
                0
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500">Materias sin grupos asignados</p>
        </div>
      </div>

      {/* Formulario de Nueva Materia */}
      <AddMateriaForm />

      {/* Lista de Materias */}

      <div
        className="bg-white shadow-lg border border-gray-100"
        style={{ borderRadius: "12px" }}
      >
        {/* Encabezado del Contenedor */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-2.5 bg-[#226c8f]/10"
              style={{ borderRadius: "8px" }}
            >
              <BookOpen className="w-6 h-6 text-[#226c8f]" />
            </div>
            <h3 className="text-gray-900">Materias Registradas</h3>
          </div>

          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Buscar materia por nombre o sigla..."
              value={searchMaterias}
              onChange={(e) => setSearchMaterias(e.target.value)}
              className="pl-10"
              style={{ borderRadius: "8px" }}
            />
          </div>
        </div>

        {/* Lista Scrolleable de Materias */}
        <ScrollArea className="h-[600px] p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materias
              .filter(
                (m) =>
                  m.nombre
                    .toLowerCase()
                    .includes(searchMaterias.toLowerCase()) ||
                  m.sigla.toLowerCase().includes(searchMaterias.toLowerCase())
              )
              .map((materia) => (
                <MateriaCard key={materia.id_materia} materia={materia} />
              ))}
          </div>
        </ScrollArea>
      </div>

      <ToastContainer />
      <EditMateria />
      <DeleteMateria />
    </div>
  );
}

export default Materias;

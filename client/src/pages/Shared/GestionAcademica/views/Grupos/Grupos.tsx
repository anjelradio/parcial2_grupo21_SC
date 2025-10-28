import { useState } from "react";
import { ArrowLeft, BookOpen, School, Users, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../../../../stores/useAppStore";
import AddGrupoForm from "./AddGrupoForm";
import GrupoCard from "./GrupoCard";
function Grupos() {
  const { grupos } = useAppStore();
  const navigate = useNavigate();
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {grupos.map((grupo) => (
          <GrupoCard key={grupo.id_grupo} grupo={grupo}/>
        ))}
      </div>
    </div>
  );
}

export default Grupos;

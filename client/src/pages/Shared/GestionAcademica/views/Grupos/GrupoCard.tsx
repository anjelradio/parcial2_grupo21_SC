import { Trash2, Edit, Users } from "lucide-react";
import type { Grupo } from "../../../../../types";
import { useAppStore } from "../../../../../stores/useAppStore";
import { Badge } from "../../../../../components/ui/badge";

type GrupoCardProps = {
  grupo: Grupo;
};

function GrupoCard({ grupo }: GrupoCardProps) {
  const grupoColor = "#10b981";
  const grupoBg = "bg-emerald-50/50";
  const { selectGrupo, setModal } = useAppStore();

  const handleEdit = () => {
    selectGrupo(grupo.id_grupo);
    setModal("editGrupo", true);
  };

  const handleDelete = () => {
    selectGrupo(grupo.id_grupo);
    setModal("deleteGrupo", true);
  };

  return (
    <div
      className={`${grupoBg} p-6 shadow-md hover:shadow-xl transition-all duration-300 relative group overflow-hidden`}
      style={{
        borderRadius: "10px",
        border: "1px solid #e5e7eb",
        borderLeft: `5px solid ${grupoColor}`,
      }}
    >
      {/* Franja decorativa superior derecha */}
      <div
        className="absolute top-0 right-0 w-24 h-24 opacity-10 group-hover:opacity-20 transition-opacity"
        style={{
          background: grupoColor,
          borderRadius: "0 10px 0 100%",
        }}
      />

      {/* Ícono decorativo grande de fondo */}
      <div className="absolute bottom-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Users className="w-16 h-16" style={{ color: grupoColor }} />
      </div>

      <div className="relative z-10 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className="p-2"
              style={{
                borderRadius: "6px",
                backgroundColor: grupoColor + "20",
              }}
            >
              <Users className="w-5 h-5" style={{ color: grupoColor }} />
            </div>
            <h4 style={{ color: grupoColor }}>{grupo.nombre}</h4>
          </div>
        </div>
        <div className="space-y-2 pl-1">
          <div className="flex items-start gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full mt-2"
              style={{ backgroundColor: grupoColor }}
            ></div>
            <p className="text-gray-900 leading-relaxed">
              {grupo.nombre_materia}
            </p>
          </div>
          <div className="flex items-center gap-2 ml-3">
            <Badge
              className="bg-[#226c8f]/10 text-[#226c8f] border border-[#226c8f]/20"
              style={{ borderRadius: "4px" }}
            >
              {grupo.sigla_materia}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-5 pt-4 border-t border-emerald-200/50">
        <button
          onClick={() => handleEdit()}
          className="flex-1 px-3 py-2.5 bg-[#2c415a] text-white hover:bg-[#1f2f3f] transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
          style={{ borderRadius: "6px" }}
        >
          <Edit className="w-4 h-4" />
          <span className="text-sm">Editar</span>
        </button>
        <button
          onClick={() => handleDelete()}
          className="flex-1 px-3 py-2.5 bg-white text-red-600 hover:bg-red-50 transition-all duration-300 flex items-center justify-center gap-2 border border-red-200 shadow-sm"
          style={{ borderRadius: "6px" }}
        >
          <Trash2 className="w-4 h-4" />
          <span className="text-sm">Eliminar</span>
        </button>
      </div>
    </div>
  );
}

export default GrupoCard;

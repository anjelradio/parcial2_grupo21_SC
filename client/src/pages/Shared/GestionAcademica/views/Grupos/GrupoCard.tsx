import { Trash2, Edit, Users } from "lucide-react";
import type { Grupo } from "../../../../../types";
import { useAppStore } from "../../../../../stores/useAppStore";

type GrupoCardProps = {
  grupo: Grupo;
};

function GrupoCard({ grupo }: GrupoCardProps) {
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
      className="bg-white p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
      style={{ borderRadius: "8px" }}
    >
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-[#226c8f]" />
          <h4 className="text-[#226c8f]">{grupo.nombre}</h4>
        </div>
        <div className="space-y-1">
          <p className="text-gray-900">{grupo.nombre_materia}</p>
          <p className="text-sm text-gray-600">{grupo.sigla_materia}</p>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleEdit}
          className="flex-1 px-3 py-2 bg-[#226c8f] text-white hover:bg-[#1a5470] transition-colors flex items-center justify-center gap-2"
          style={{ borderRadius: "8px" }}
        >
          <Edit className="w-4 h-4" />
          Editar
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
          style={{ borderRadius: "8px" }}
        >
          <Trash2 className="w-4 h-4" />
          Eliminar
        </button>
      </div>
    </div>
  );
}

export default GrupoCard;
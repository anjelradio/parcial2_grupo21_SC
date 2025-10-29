import { BookOpen, Edit, Trash2 } from "lucide-react";
import type { Materia } from "../../../../../types";
import { useAppStore } from "../../../../../stores/useAppStore";

type MateriaCardProps = {
  materia: Materia;
};

function MateriaCard({ materia }: MateriaCardProps) {
  const { selectMateria, setModal } = useAppStore();

  const handleEdit = () => {
    selectMateria(materia.id_materia);
    setModal("editMateria", true);
  };

  const handleDelete = () => {
    selectMateria(materia.id_materia);
    setModal("deleteMateria", true);
  };

  return (
    <div
      className="bg-white p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
      style={{ borderRadius: "8px" }}
    >
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-[#226c8f]" />
          <h4 className="text-[#226c8f]">{materia.sigla}</h4>
        </div>
        <p className="text-gray-900">{materia.nombre}</p>
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

export default MateriaCard;
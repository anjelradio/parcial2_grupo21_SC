import { Trash2, Edit, Calendar } from "lucide-react";
import type { Dia } from "../../../../../types";
import { useAppStore } from "../../../../../stores/useAppStore";

type DiaCardProps = {
  dia: Dia;
};

function DiaCard({ dia }: DiaCardProps) {
  const { selectDia, setModal } = useAppStore();

  const handleEdit = () => {
    selectDia(dia.id_dia);
    setModal("diasList", false);
    setModal("editDia", true);
  };

  const handleDelete = () => {
    selectDia(dia.id_dia);
    setModal("diasList", false);
    setModal("deleteDia", true);
  };

  return (
    <div
      className="bg-white p-4 shadow border border-gray-100 flex items-center justify-between hover:shadow-md transition-all"
      style={{ borderRadius: "8px" }}
    >
      <div className="flex items-center gap-3">
        <Calendar className="w-5 h-5 text-[#226c8f]" />
        <p className="text-gray-900">{dia.nombre}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleEdit}
          className="px-3 py-1.5 bg-[#226c8f] text-white hover:bg-[#1a5470] transition-colors flex items-center gap-1 text-sm"
          style={{ borderRadius: "8px" }}
        >
          <Edit className="w-3 h-3" />
          Editar
        </button>
        <button
          onClick={handleDelete}
          className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center gap-1 text-sm"
          style={{ borderRadius: "8px" }}
        >
          <Trash2 className="w-3 h-3" />
          Eliminar
        </button>
      </div>
    </div>
  );
}

export default DiaCard;
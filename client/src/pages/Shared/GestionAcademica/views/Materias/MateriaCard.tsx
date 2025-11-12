import { BookOpen, Edit, Trash2 } from "lucide-react";
import type { Materia } from "../../../../../types";
import { useAppStore } from "../../../../../stores/useAppStore";

type MateriaCardProps = {
  materia: Materia;
};

function MateriaCard({ materia }: MateriaCardProps) {
  const materiaColor = "#226c8f";
  const materiaBg = "bg-blue-50/50";
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
      className={`${materiaBg} p-6 shadow-md hover:shadow-xl transition-all duration-300 relative group overflow-hidden`}
      style={{
        borderRadius: "10px",
        border: "1px solid #e5e7eb",
        borderLeft: `5px solid ${materiaColor}`,
      }}
    >
      {/* Franja decorativa superior derecha */}
      <div
        className="absolute top-0 right-0 w-24 h-24 opacity-10 group-hover:opacity-20 transition-opacity"
        style={{
          background: materiaColor,
          borderRadius: "0 10px 0 100%",
        }}
      />

      {/* Ícono decorativo grande de fondo */}
      <div className="absolute bottom-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <BookOpen className="w-16 h-16" style={{ color: materiaColor }} />
      </div>

      <div className="relative z-10 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className="p-2"
              style={{
                borderRadius: "6px",
                backgroundColor: materiaColor + "20",
              }}
            >
              <BookOpen className="w-5 h-5" style={{ color: materiaColor }} />
            </div>
            <h4 style={{ color: materiaColor }}>{materia.sigla}</h4>
          </div>
        </div>
        <div className="space-y-2 pl-1">
          <div className="flex items-start gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full mt-2"
              style={{ backgroundColor: materiaColor }}
            ></div>
            <p className="text-gray-900 leading-relaxed">{materia.nombre}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-5 pt-4 border-t border-blue-200/50">
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

export default MateriaCard;

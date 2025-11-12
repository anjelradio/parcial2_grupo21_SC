import { Badge } from "../../../../../components/ui/badge";
import { Building2, Edit, Trash2 } from "lucide-react";
import type { Aula } from "../../../../../types";
import { useAppStore } from "../../../../../stores/useAppStore";

type AulaCardProps = {
  aula: Aula;
};

function AulaCard({ aula }: AulaCardProps) {
  const { selectAula, setModal } = useAppStore();
  // Color de la franja según estado
  const estadoColor =
    aula.estado === "Disponible"
      ? "#10b981"
      : aula.estado === "Mantenimiento"
      ? "#f59e0b"
      : "#6b7280";

  const estadoBg =
    aula.estado === "Disponible"
      ? "bg-green-50"
      : aula.estado === "Mantenimiento"
      ? "bg-yellow-50"
      : "bg-gray-50";

  const handleEdit = () => {
    selectAula(aula.nro_aula);
    setModal("editAula", true);
  };

  const handleDelete = () => {
    selectAula(aula.nro_aula);
    setModal("deleteAula", true);
  };

  return (
    <div
      className={`${estadoBg} p-6 shadow-md hover:shadow-xl transition-all duration-300 relative group overflow-hidden`}
      style={{
        borderRadius: "10px",
        border: "1px solid #e5e7eb",
        borderLeft: `5px solid ${estadoColor}`,
      }}
    >
      {/* Franja de color de estado */}
      <div
        className="absolute top-0 right-0 w-24 h-24 opacity-10 group-hover:opacity-20 transition-opacity"
        style={{
          background: estadoColor,
          borderRadius: "0 10px 0 100%",
        }}
      />

      {/* Ícono decorativo */}
      <div className="absolute bottom-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Building2 className="w-16 h-16" style={{ color: estadoColor }} />
      </div>

      <div className="relative z-10 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className="p-2"
              style={{
                borderRadius: "6px",
                backgroundColor: estadoColor + "20",
              }}
            >
              <Building2 className="w-5 h-5" style={{ color: estadoColor }} />
            </div>
            <h4 style={{ color: estadoColor }}>Aula {aula.nro_aula}</h4>
          </div>
          <Badge
            className={`${
              aula.estado === "Disponible"
                ? "bg-green-100 text-green-700 border-green-300"
                : aula.estado === "Mantenimiento"
                ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                : "bg-gray-100 text-gray-700 border-gray-300"
            } border`}
            style={{ borderRadius: "4px" }}
          >
            {aula.estado}
          </Badge>
        </div>
        <div className="space-y-2 pl-1">
          <div className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: estadoColor }}
            ></div>
            <p className="text-gray-900">{aula.tipo}</p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: estadoColor }}
            ></div>
            <p className="text-sm text-gray-600">
              Capacidad: {aula.capacidad} personas
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-5 pt-4 border-t border-gray-200">
        <button
          onClick={() => handleEdit()}
          className="flex-1 px-3 py-2.5 bg-[#226c8f] text-white hover:bg-[#1a5470] transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
          style={{ borderRadius: "6px" }}
        >
          <Edit className="w-4 h-4" />
          <span className="text-sm">Editar</span>
        </button>
        <button
          onClick={() => handleDelete()}
          className="flex-1 px-3 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-2 border border-red-200"
          style={{ borderRadius: "6px" }}
        >
          <Trash2 className="w-4 h-4" />
          <span className="text-sm">Eliminar</span>
        </button>
      </div>
    </div>
  );
}

export default AulaCard;

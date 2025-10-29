import { Edit, Clock, Trash2 } from "lucide-react";
import type { BloqueHorario } from "../../../../../types";
import { useAppStore } from "../../../../../stores/useAppStore";

type HorarioCardProps = {
  horario: BloqueHorario;
};

function HorarioCard({ horario }: HorarioCardProps) {
  const { selectBloqueHorario, setModal } = useAppStore();

  function obtenerTurno(horaInicio: string): "Mañana" | "Tarde" | "Noche" {
    const [h, m] = horaInicio.split(":").map(Number);
    const horaDecimal = h + m / 60;

    if (horaDecimal >= 6 && horaDecimal < 12) return "Mañana";
    if (horaDecimal >= 12 && horaDecimal < 18) return "Tarde";
    return "Noche";
  }

  const handleEdit = () => {
    selectBloqueHorario(horario.id_bloque);
    setModal("horarioList", false);
    setModal("editHorario", true);
  };

  const handleDelete = () => {
    selectBloqueHorario(horario.id_bloque);
    setModal("horarioList", false);
    setModal("deleteHorario", true);
  };

  return (
    <div
      className="bg-white p-4 shadow border border-gray-100 flex items-center justify-between hover:shadow-md transition-all"
      style={{ borderRadius: "8px" }}
    >
      <div className="flex items-center gap-3">
        <Clock className="w-5 h-5 text-[#226c8f]" />
        <div>
          <p className="text-gray-900">{horario.rango}</p>
          <p className="text-xs text-gray-500">
            {obtenerTurno(horario.hora_inicio)}
          </p>
        </div>
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

export default HorarioCard;

import {
  BookOpen,
  Building2,
  Calendar,
  ClipboardCheck,
  Clock,
  Edit,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";
import type { Asignacion } from "../../../types";
import { useAppStore } from "../../../stores/useAppStore";
import { AnimatedBorderCard } from "../../../components/ui/AnimatedBorderCard";

type AsignacionCardProps = {
  asignacion: Asignacion;
};

function AsignacionCard({ asignacion }: AsignacionCardProps) {
  const { setModal, selectAsignacion } = useAppStore();

  const onEdit = () => {
    selectAsignacion(asignacion.id_asignacion);
    setModal("editAsignacion", true);
  };

  const onDelete = () => {
    selectAsignacion(asignacion.id_asignacion);
    setModal("deleteAsignacion", true);
  };

  return (
    <AnimatedBorderCard
      borderColor="#226c8f"
      gradientFrom="from-[#e8f1f5]"
      gradientTo="to-[#f0f4f8]"
    >
      <div className="relative group">
        {/* Ícono de fondo decorativo */}
        <div className="absolute -right-8 -bottom-8 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-300">
          <ClipboardCheck className="w-48 h-48 text-[#226c8f]" />
        </div>

        <div className="relative z-10">
          {/* Header de la carta con nombre del docente y acciones */}
          <div className="flex items-start justify-between mb-4 pb-3 border-b border-[#226c8f]/20">
            <div className="flex items-center gap-3">
              <div
                className="p-2 bg-[#226c8f]/10 group-hover:bg-[#226c8f]/20 transition-colors"
                style={{ borderRadius: "8px" }}
              >
                <UserCheck className="w-5 h-5 text-[#226c8f]" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Docente Asignado</p>
                <p className="text-gray-900 tracking-wide">
                  {asignacion.docente?.nombre_completo ??
                    asignacion.codigo_docente}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onEdit}
                className="p-2 bg-white text-[#2c415a] hover:bg-[#226c8f] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                style={{ borderRadius: "6px" }}
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 bg-white text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                style={{ borderRadius: "6px" }}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Información principal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white/60 p-3" style={{ borderRadius: "8px" }}>
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-4 h-4 text-[#226c8f]" />
                <p className="text-xs text-gray-600">Materia</p>
              </div>
              <p className="text-gray-900 text-sm">
                {asignacion.grupo?.materia?.nombre ?? "—"}
              </p>
            </div>

            <div className="bg-white/60 p-3" style={{ borderRadius: "8px" }}>
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-[#226c8f]" />
                <p className="text-xs text-gray-600">Grupo</p>
              </div>
              <p className="text-[#226c8f] text-sm">
                {asignacion.grupo?.nombre ?? "—"}
              </p>
            </div>

            <div className="bg-white/60 p-3" style={{ borderRadius: "8px" }}>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-[#226c8f]" />
                <p className="text-xs text-gray-600">Semestre</p>
              </div>
              <p className="text-gray-900 text-sm">
                {asignacion.gestion?.nombre_gestion ?? "N/A"}
              </p>
            </div>
          </div>

          {/* Mostrar horarios */}
          {asignacion.detalles_horario &&
            asignacion.detalles_horario.length > 0 && (
              <div className="bg-white/40 p-4" style={{ borderRadius: "8px" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-[#226c8f]" />
                  <p className="text-xs text-gray-700">Horarios de Clase</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {asignacion.detalles_horario.map((h, idx) => (
                    <div
                      key={idx}
                      className="bg-white px-3 py-2 border-l-2 border-[#226c8f] shadow-sm"
                      style={{ borderRadius: "6px" }}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Calendar className="w-3 h-3 text-[#226c8f]" />
                        <span className="text-xs text-[#226c8f]">
                          {h.dia?.nombre}
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 mb-0.5">
                        {h.bloque?.rango}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-600">
                          Aula {h.aula?.nro_aula}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </AnimatedBorderCard>
  );
}

export default AsignacionCard;

import { Edit, Trash2 } from "lucide-react";
import type { Asignacion } from "../../../types";
import { useAppStore } from "../../../stores/useAppStore";

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
    <div
      className="border-l-4 border-[#226c8f] bg-gray-50 p-4 transition-all duration-300 hover:bg-gray-100"
      style={{ borderRadius: "0 8px 8px 0" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
        <div>
          <p className="text-xs text-gray-500">Docente</p>
          <p className="text-gray-900">
            {asignacion.docente?.nombre_completo ?? asignacion.codigo_docente}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Grupo</p>
          <p className="text-[#226c8f]">{asignacion.grupo?.nombre ?? "—"}</p>
        </div>
        <div className="lg:col-span-2">
          <p className="text-xs text-gray-500">Materia</p>
          <p className="text-gray-900">
            {asignacion.grupo?.materia?.nombre ?? "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Semestre</p>
          <p className="text-gray-900">
            {asignacion.gestion?.nombre_gestion ?? "N/A"}
          </p>
        </div>
        <div className="flex gap-2 justify-start lg:justify-end items-start">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 transition-colors"
            style={{ borderRadius: "8px" }}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 transition-colors"
            style={{ borderRadius: "8px" }}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mostrar horarios */}
      {asignacion.detalles_horario &&
        asignacion.detalles_horario.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Horarios:</p>
            <div className="flex flex-wrap gap-2">
              {asignacion.detalles_horario.map((h, idx) => (
                <div
                  key={idx}
                  className="bg-white px-3 py-1.5 text-xs border border-gray-200"
                  style={{ borderRadius: "6px" }}
                >
                  <span className="text-[#226c8f]">{h.dia?.nombre}</span>
                  <span className="text-gray-600 mx-1">•</span>
                  <span className="text-gray-700">{h.bloque?.rango}</span>
                  <span className="text-gray-600 mx-1">•</span>
                  <span className="text-gray-700">Aula {h.aula?.nro_aula}</span>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}

export default AsignacionCard;

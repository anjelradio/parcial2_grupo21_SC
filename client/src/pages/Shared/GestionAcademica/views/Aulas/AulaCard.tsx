import { Badge } from "../../../../../components/ui/badge";
import { Building2, Edit, Trash2 } from "lucide-react";
import type { Aula } from "../../../../../types";

type AulaCardProps = {
    aula: Aula
}

function AulaCard({aula} : AulaCardProps) {
  return (
    <div
      className="bg-white p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
      style={{ borderRadius: "8px" }}
    >
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#226c8f]" />
            <h4 className="text-[#226c8f]">Aula {aula.nro_aula}</h4>
          </div>
          <Badge
            className={`${
              aula.estado === "Disponible"
                ? "bg-green-100 text-green-600"
                : aula.estado === "Mantenimiento"
                ? "bg-yellow-100 text-yellow-600"
                : "bg-red-100 text-red-600"
            }`}
            style={{ borderRadius: "4px" }}
          >
            {aula.estado}
          </Badge>
        </div>
        <div className="space-y-1">
          <p className="text-gray-900">{aula.tipo}</p>
          <p className="text-sm text-gray-600">
            Capacidad: {aula.capacidad} personas
          </p>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          
          className="flex-1 px-3 py-2 bg-[#226c8f] text-white hover:bg-[#1a5470] transition-colors flex items-center justify-center gap-2"
          style={{ borderRadius: "8px" }}
        >
          <Edit className="w-4 h-4" />
          Editar
        </button>
        <button
          
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

export default AulaCard;

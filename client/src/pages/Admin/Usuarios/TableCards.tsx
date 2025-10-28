import { Mail } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import type { Usuario } from "../../../types";
import { useAppStore } from "../../../stores/useAppStore";

interface TableCardsProps {
  usuario: Usuario;
}

function TableCards({ usuario }: TableCardsProps) {
  const { selectUser, setModal } = useAppStore();

  const handleClick = () => {
    selectUser(usuario.id);
    setModal("editUser", true);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white p-4 border border-gray-200 cursor-pointer hover:shadow-md transition-all"
      style={{ borderRadius: "8px" }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="text-gray-900 font-medium mb-1">
            {usuario.nombre_completo}
          </h4>
          {usuario.codigo_docente && (
            <p className="text-sm text-gray-500">
              Código: {usuario.codigo_docente}
            </p>
          )}
        </div>
        <Badge
          className={`${
            usuario.rol === "ADMIN"
              ? "bg-red-100 text-red-600"
              : usuario.rol === "AUTORIDAD"
              ? "bg-blue-100 text-blue-600"
              : "bg-green-100 text-green-600"
          }`}
          style={{ borderRadius: "4px" }}
        >
          {usuario.rol}
        </Badge>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Mail className="w-4 h-4" />
        {usuario.email}
      </div>
    </div>
  );
}

export default TableCards;
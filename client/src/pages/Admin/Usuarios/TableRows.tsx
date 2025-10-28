import { TableRow, TableCell } from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import type { Usuario } from "../../../types";
import { useAppStore } from "../../../stores/useAppStore";

interface TableRowsProps {
  usuario: Usuario;
}

function TableRows({ usuario }: TableRowsProps) {
  const { selectUser, setModal } = useAppStore();

  const handleClick = () => {
    selectUser(usuario.id);
    setModal("editUser", true);
  };

  return (
    <TableRow
      onClick={handleClick}
      className="cursor-pointer hover:bg-gray-50 transition-colors"
    >
      <TableCell>
        <div className="font-medium text-gray-900">
          {usuario.nombre_completo}
        </div>
        {usuario.codigo_docente && (
          <div className="text-sm text-gray-500">
            Código: {usuario.codigo_docente}
          </div>
        )}
      </TableCell>
      <TableCell>{usuario.email}</TableCell>
      <TableCell>
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
      </TableCell>
    </TableRow>
  );
}

export default TableRows;
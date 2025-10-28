import { useEffect } from "react";
import { Users, GraduationCap, ShieldCheck, User } from "lucide-react";
import CreateUserForm from "./CreateUserForm";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "../../../components/ui/table";
import TableRows from "./TableRows";
import TableCards from "./TableCards";
import { useAppStore } from "../../../stores/useAppStore";
import EditUser from "./Modals/EditUser";
import DeleteUser from "./Modals/DeleteUser";
import { ToastContainer } from "react-toastify";

function Usuarios() {
  const { users, setGlobalLoading, fetchUsers, hasLoadedUsers } = useAppStore();
  useEffect(() => {
    const cargar = async () => {
      if (!hasLoadedUsers) setGlobalLoading(true);
      await Promise.all([fetchUsers()]);
      setGlobalLoading(false);
    };
    cargar();
  }, [fetchUsers, hasLoadedUsers, setGlobalLoading]);


  const totalUsuarios = users?.length;
  const totalDocentes = users?.filter((user) => user.rol === "DOCENTE").length;
  const totalAutoridad = users?.filter(
    (user) => user.rol === "AUTORIDAD"
  ).length;
  const totalAdmin = users?.filter((user) => user.rol === "ADMIN").length;
  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Gestión de Usuarios</h1>
        <p className="text-gray-600">Administra cuentas y roles del sistema</p>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          className="bg-white p-6 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl"
          style={{ borderRadius: "8px" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="p-3 bg-[#226c8f]/10"
              style={{ borderRadius: "8px" }}
            >
              <Users className="w-6 h-6 text-[#226c8f]" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Total Usuarios</p>
              <p className="text-2xl text-[#226c8f]">{totalUsuarios}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">Registrados en el sistema</p>
        </div>

        <div
          className="bg-white p-6 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl"
          style={{ borderRadius: "8px" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="p-3 bg-green-500/10"
              style={{ borderRadius: "8px" }}
            >
              <GraduationCap className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Total Docentes</p>
              <p className="text-2xl text-[#226c8f]">{totalDocentes}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">Profesores activos</p>
        </div>

        <div
          className="bg-white p-6 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl"
          style={{ borderRadius: "8px" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-blue-500/10" style={{ borderRadius: "8px" }}>
              <ShieldCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Total Autoridades</p>
              <p className="text-2xl text-[#226c8f]">{totalAutoridad}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">Personal administrativo</p>
        </div>

        <div
          className="bg-white p-6 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl"
          style={{ borderRadius: "8px" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-red-500/10" style={{ borderRadius: "8px" }}>
              <User className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Total Administradores</p>
              <p className="text-2xl text-[#226c8f]">{totalAdmin}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">Administradores del sistema</p>
        </div>
      </div>
      {/* Formulario de Creación de Cuenta */}
      <CreateUserForm />

      {/* Lista de Usuarios */}
      <div
        className="bg-white shadow-lg border border-gray-100"
        style={{ borderRadius: "8px" }}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div
              className="w-1 h-6 bg-[#226c8f]"
              style={{ borderRadius: "2px" }}
            ></div>
            <h3 className="text-gray-900">Lista de Usuarios</h3>
          </div>
        </div>

        {/* Vista Desktop - Tabla */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre Completo</TableHead>
                <TableHead>Correo Electrónico</TableHead>
                <TableHead>Rol Asignado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((usuario) => (
                <TableRows key={usuario.id} usuario={usuario} />
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Vista Mobile - Cards */}
        <div className="md:hidden p-4 space-y-3">
          {users.map((usuario) => (
            <TableCards key={usuario.id} usuario={usuario} />
          ))}
        </div>
      </div>
      <EditUser/>
      <DeleteUser/>
      <ToastContainer/>
    </div>
  );
}

export default Usuarios;

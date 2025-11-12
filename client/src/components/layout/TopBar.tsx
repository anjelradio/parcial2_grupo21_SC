import logoImage from "/LogoFicct.png";
import {
  Home,
  CheckSquare,
  Calendar,
  BarChart3,
  FileText,
  Users,
  Building2,
  BookOpen,
  ShieldCheck,
  User,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import type { Usuario } from "../../types";

interface TopBarProps {
  user: Usuario;
}

export default function TopBar({ user }: TopBarProps) {
  // Determinar basePath según el rol
  const getBasePath = () => {
    switch (user.rol) {
      case "DOCENTE":
        return "docente";
      case "AUTORIDAD":
        return "autoridad";
      case "ADMIN":
        return "admin";
      default:
        return "";
    }
  };

  const basePath = getBasePath();

  // --- TABS SEGÚN ROL ---
  const getTabsByRole = () => {
    switch (user.rol) {
      case "DOCENTE":
        return [
          { id: "inicio", label: "INICIO", icon: Home },
          { id: "asistencias", label: "ASISTENCIAS", icon: CheckSquare },
          { id: "horarios", label: "HORARIOS", icon: Calendar },
          { id: "estadisticas", label: "ESTADÍSTICAS", icon: BarChart3 },
        ];
      case "AUTORIDAD":
        return [
          { id: "inicio", label: "INICIO", icon: Home },
          { id: "reportes", label: "REPORTES", icon: FileText },
          { id: "control-docente", label: "CONTROL DOCENTE", icon: Users },
          {
            id: "gestion-academica",
            label: "GESTIÓN ACADÉMICA",
            icon: Building2,
          },
        ];
      case "ADMIN":
        return [
          { id: "inicio", label: "INICIO", icon: Home },
          {
            id: "gestion-academica",
            label: "GESTIÓN ACADÉMICA",
            icon: Building2,
          },
          { id: "asignaciones", label: "ASIGNACIONES", icon: BookOpen },
          {
            id: "control-docente",
            label: "CONTROL DOCENTE",
            icon: ShieldCheck,
          },
          { id: "usuarios", label: "USUARIOS Y SISTEMA", icon: Users },
        ];
      default:
        return [];
    }
  };

  const tabs = getTabsByRole();

  // Obtener el nombre del rol formateado
  const getRoleName = () => {
    switch (user.rol) {
      case "DOCENTE":
        return "Docente";
      case "AUTORIDAD":
        return "Autoridad";
      case "ADMIN":
        return "Administrador";
      default:
        return user.rol;
    }
  };

  return (
    <header className="bg-[#2c415a] border-b border-[#226c8f]/20 shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-8 lg:px-16 py-2 flex items-center justify-between gap-6">
        {/* --- LOGO IZQUIERDA --- */}
        <div className="flex items-center">
          <img
            src={logoImage}
            alt="Universidad Logo"
            className="object-contain"
            style={{ width: "85px", height: "85px" }}
          />
        </div>

        {/* --- NAVEGACIÓN CENTRAL --- */}
        <nav
          className="hidden lg:flex items-center gap-1.5 flex-1"
          style={{ fontFamily: "Inter, system-ui, sans-serif" }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <NavLink
                key={tab.id}
                to={`/${basePath}/${tab.id}`}
                className={({ isActive }) =>
                  `
                  px-5 py-2.5 flex items-center gap-2
                  transition-all duration-300 relative group
                  ${
                    isActive
                      ? "text-white bg-[#226c8f] shadow-sm"
                      : "text-gray-300 hover:bg-[#226c8f]/10 hover:text-white"
                  }
                `
                }
                style={{
                  borderRadius: "4px",
                  letterSpacing: "0.02em",
                  fontWeight: 500,
                }}
              >
                {({ isActive }) => (
                  <>
                    {!isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-[#226c8f] w-0 group-hover:w-3/4 transition-all duration-300" />
                    )}

                    <Icon
                      className={`relative z-10 transition-all duration-300 ${
                        isActive
                          ? "text-white"
                          : "text-gray-300 group-hover:text-white"
                      }`}
                    />
                    <span className="relative z-10 text-[13px]">
                      {tab.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* --- USUARIO DERECHA --- */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-white text-sm tracking-wide">
              {user.rol === "DOCENTE" ? `Hola, ${user.nombre}` : user.nombre}
            </span>
            <span className="text-gray-400 text-xs tracking-wider">
              {getRoleName()}
            </span>
          </div>

          {/* Botón Usuario */}
          <NavLink
            to={`/perfil`}
            className="w-11 h-11 bg-[#226c8f] rounded-full flex items-center justify-center ring-2 ring-[#226c8f]/30 hover:ring-[#226c8f]/60 hover:scale-105 transition-all duration-300 cursor-pointer"
            aria-label="Perfil de usuario"
          >
            <User className="w-5 h-5 text-white" />
          </NavLink>
        </div>
      </div>
    </header>
  );
}

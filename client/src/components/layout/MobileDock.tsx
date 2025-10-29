import { createPortal } from "react-dom";
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
} from "lucide-react";
import { NavLink } from "react-router-dom";
import type { Usuario } from "../../types";

interface MobileDockProps {
  user: Usuario;
}

export function MobileDock({ user }: MobileDockProps) {
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
          { id: "aulas-materias", label: "AULAS Y MATERIAS", icon: Building2 },
        ];
      case "ADMIN":
        return [
          { id: "inicio", label: "INICIO", icon: Home },
          { id: "gestion-academica", label: "GESTIÓN ACADÉMICA", icon: Building2 },
          { id: "asignaciones", label: "ASIGNACIONES", icon: BookOpen },
          { id: "control-docente", label: "CONTROL DOCENTE", icon: ShieldCheck },
          { id: "usuarios", label: "USUARIOS", icon: Users },
        ];
      default:
        return [];
    }
  };

  const tabs = getTabsByRole();
  const gridCols = user.rol === "ADMIN" ? "grid-cols-5" : "grid-cols-4";

  // Contenido del dock flotante
  const dockContent = (
    <div className="lg:hidden fixed bottom-6 left-4 right-4 z-50">
      {/* Dock container con sombra y fondo glassmorphism */}
      <div
        className="backdrop-blur-md bg-[#2c415a]/95 shadow-2xl border border-[#226c8f]/30"
        style={{ borderRadius: "16px" }}
      >
        <div className={`grid ${gridCols} gap-2 p-3`}>
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <NavLink
                key={tab.id}
                to={`/${basePath}/${tab.id}`}
                className={({ isActive }) =>
                  `
                  relative
                  flex flex-col items-center justify-center gap-2
                  py-3 px-2
                  transition-all duration-300 ease-out
                  cursor-pointer
                  ${
                    isActive
                      ? "text-white scale-105"
                      : "text-gray-400 hover:text-white hover:scale-105"
                  }
                `
                }
                style={({ isActive }) => ({
                  borderRadius: "12px",
                  backgroundColor: isActive
                    ? "rgba(34, 108, 143, 0.2)"
                    : "transparent",
                })}
              >
                {({ isActive }) => (
                  <>
                    {/* Indicador activo - barra superior */}
                    {isActive && (
                      <div
                        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-[#226c8f]"
                        style={{
                          borderRadius: "0 0 4px 4px",
                          boxShadow: "0 4px 8px rgba(34, 108, 143, 0.4)",
                        }}
                      />
                    )}

                    {/* Ícono con animación */}
                    <div
                      className={`
                      relative
                      transition-all duration-300
                      ${isActive ? "transform translate-y-0.5" : ""}
                    `}
                    >
                      <Icon
                        className={`
                          w-6 h-6 
                          transition-all duration-300
                          ${isActive ? "text-[#226c8f] drop-shadow-lg" : ""}
                        `}
                      />

                      {/* Glow effect para ícono activo */}
                      {isActive && (
                        <div
                          className="absolute inset-0 blur-md opacity-50"
                          style={{
                            backgroundColor: "#226c8f",
                          }}
                        />
                      )}
                    </div>

                    {/* Label */}
                    <span
                      className={`
                        text-[10px] 
                        text-center 
                        leading-tight 
                        tracking-wide
                        transition-all duration-300
                        ${user.rol === "ADMIN" ? "text-[9px]" : ""}
                        ${isActive ? "font-medium" : "font-normal"}
                      `}
                    >
                      {tab.label}
                    </span>

                    {/* Efecto de resaltado en hover */}
                    {!isActive && (
                      <div
                        className="absolute inset-0 bg-white/0 hover:bg-white/5 transition-colors duration-300"
                        style={{ borderRadius: "12px" }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Portal al body
  return createPortal(dockContent, document.body);
}
import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

interface InstitutionalButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon;
  variant?: "primary" | "secondary" | "icon-top";
  size?: "default" | "large";
  children: React.ReactNode;
}
function Button({
  icon: Icon,
  variant = "primary",
  size = "default",
  className = "",
  children,
  disabled,
  ...props
}: InstitutionalButtonProps) {
  const bgColor =
    variant === "primary" || variant === "icon-top" ? "#226c8f" : "#6b7280";

  // Variante con ícono arriba (para botones de asistencia)
  if (variant === "icon-top") {
    return (
      <button
        className={`
          institutional-button
          w-full
          px-6 py-8
          relative overflow-hidden
          flex flex-col items-center justify-center gap-4
          transition-shadow duration-300
          disabled:opacity-50 disabled:cursor-not-allowed
          shadow-lg hover:shadow-xl
          ${disabled ? "" : "cursor-pointer"}
          ${className}
        `}
        style={{
          backgroundColor: bgColor,
        }}
        disabled={disabled}
        {...props}
      >
        {/* Capa de fondo blanco que asciende desde abajo */}
        {!disabled && (
          <div className="button-overlay"  />
        )}

        {/* Contenido del botón */}
        {Icon && <Icon className="button-icon w-12 h-12 relative z-10" />}
        <span
          className="button-text uppercase tracking-wide text-center relative z-10"
          style={{ fontSize: "14px" }}
        >
          {children}
        </span>

        {/* Estilos específicos del botón */}
        <style>{`
          .institutional-button {
            position: relative;
          }
          
          .button-overlay {
            position: absolute;
            inset: 0;
            background-color: white;
            transform: translateY(100%);
            transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 1;
          }
          
          .institutional-button:not(:disabled):hover .button-overlay,
          .institutional-button:not(:disabled):active .button-overlay {
            transform: translateY(0);
          }
          
          .button-icon {
            color: white;
            transition: color 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .button-text {
            color: white;
            transition: color 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .institutional-button:not(:disabled):hover .button-icon,
          .institutional-button:not(:disabled):hover .button-text,
          .institutional-button:not(:disabled):active .button-icon,
          .institutional-button:not(:disabled):active .button-text {
            color: ${bgColor};
          }
        `}</style>
      </button>
    );
  }

  // Variante estándar
  const sizeClasses =
    size === "large"
      ? "px-8 py-6 text-base min-h-[80px]"
      : "px-6 py-5 min-h-[70px]";

  return (
    <button
      className={`
        institutional-button
        ${sizeClasses}
        w-full
        uppercase tracking-wide 
        relative overflow-hidden
        flex items-center justify-center gap-3
        transition-shadow duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        shadow-lg hover:shadow-xl
        ${disabled ? "" : "cursor-pointer"}
        ${className}
      `}
      style={{
        backgroundColor: bgColor,
      }}
      disabled={disabled}
      {...props}
    >
      {/* Capa de fondo blanco que asciende desde abajo */}
      {!disabled && (
        <div className="button-overlay"  />
      )}

      {/* Contenido del botón */}
      <div className="relative z-10 flex items-center justify-center gap-3">
        {Icon && <Icon className="button-icon w-6 h-6" />}
        <span className="button-text">{children}</span>
      </div>

      {/* Estilos específicos del botón */}
      <style>{`
        .institutional-button {
          position: relative;
        }
        
        .button-overlay {
          position: absolute;
          inset: 0;
          background-color: white;
          transform: translateY(100%);
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1;
        }
        
        .institutional-button:not(:disabled):hover .button-overlay,
        .institutional-button:not(:disabled):active .button-overlay {
          transform: translateY(0);
        }
        
        .button-icon {
          color: white;
          transition: color 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .button-text {
          color: white;
          transition: color 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .institutional-button:not(:disabled):hover .button-icon,
        .institutional-button:not(:disabled):hover .button-text,
        .institutional-button:not(:disabled):active .button-icon,
        .institutional-button:not(:disabled):active .button-text {
          color: ${bgColor};
        }
      `}</style>
    </button>
  );
}

export default Button;

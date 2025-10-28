import { useAppStore } from "../../stores/useAppStore";

export default function GlobalLoader() {
//   const { isGlobalLoading } = useAppStore();

//   if (!isGlobalLoading) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center 
      bg-[#f7f9fb]/60 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center justify-center">
        {/* Pulso institucional */}
        <div className="relative flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-[#226c8f] animate-pulse shadow-lg shadow-[#226c8f]/30"></div>
          <div className="absolute w-14 h-14 rounded-full bg-[#226c8f]/20 animate-ping"></div>
        </div>

        {/* Texto */}
        <span className="mt-6 text-base font-medium text-[#2c425a] tracking-wide">
          Cargando...
        </span>

        {/* Línea decorativa */}
        <div className="mt-3 w-32 h-0.5 bg-gradient-to-r from-[#2c425a] to-[#226c8f] rounded-full"></div>
      </div>
    </div>
  );
}

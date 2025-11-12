import { type ReactNode } from 'react';

interface AnimatedBorderCardProps {
  children: ReactNode;
  onClick?: () => void;
  borderColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  className?: string;
}

export function AnimatedBorderCard({ 
  children, 
  onClick, 
  borderColor = 'rgba(34, 65, 90, 0.8)', // #2c415a con opacidad
  gradientFrom = 'from-blue-50',
  gradientTo = 'to-cyan-50',
  className = ''
}: AnimatedBorderCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`relative bg-gradient-to-r ${gradientFrom} ${gradientTo} shadow-md hover:shadow-xl cursor-pointer group overflow-hidden animated-border-card transition-all duration-300 ${className}`}
      style={{ borderRadius: '4px' }}
    >
      {/* Borde izquierdo animado - crece en grosor desde 0 */}
      <div 
        className="absolute left-0 top-0 w-0 h-full group-hover:w-[7px] transition-all duration-300 ease-out z-10"
        style={{ 
          backgroundColor: borderColor,
          borderRadius: '4px 0 0 4px'
        }}
      />
      
      {/* Borde inferior animado - crece en grosor desde 0 */}
      <div 
        className="absolute left-0 bottom-0 w-full h-0 group-hover:h-[7px] transition-all duration-300 ease-out z-10"
        style={{ 
          backgroundColor: borderColor,
          borderRadius: '0 0 4px 4px'
        }}
      />

      {/* Contenedor interno - se desplaza hacia arriba y derecha cuando aparecen los bordes */}
      <div className="relative p-4 transition-transform duration-300 ease-out group-hover:translate-x-[4px] group-hover:translate-y-[-4px]">
        {children}
      </div>
    </div>
  );
}

import { NavLink } from 'react-router-dom';
import { Home, Grid, Monitor, Briefcase, Zap } from 'lucide-react';

const NavBar = () => {
  const navItems = [
    { name: 'INICIO', path: '/', icon: Home },
    { name: 'CATEGORÍAS', path: '/categories', icon: Grid },
    { name: 'PLATAFORMAS', path: '/platforms', icon: Monitor },
    { name: 'DESARROLLADORES', path: '/developers', icon: Briefcase },
  ];

  return (
    // Sticky top-0 pero con un z-index menor que el Header (z-40 vs z-50)
    <nav className="sticky top-0 z-40 w-full bg-void-purple border-b-2 border-gray-800 shadow-xl overflow-hidden">
      
      {/* 1. FONDO CAÓTICO (Sutil) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Rayas de fondo */}
        <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(90deg,#000,#000_2px,transparent_2px,transparent_40px)]"></div>
        {/* Línea de neón superior */}
        <div className="absolute top-0 w-full h-px bg-linear-to-r from-transparent via-jinx-pink to-transparent opacity-50"></div>
      </div>

      <div className="relative max-w-350 mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          
          {/* 2. GRUPO DE NAVEGACIÓN */}
          <div className="flex items-center h-full gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `
                  relative h-full flex items-center gap-3 px-6 transition-all duration-200 group
                  ${isActive 
                    ? 'text-zaun-green' // Activo: Verde
                    : 'text-gray-400 hover:text-white' // Inactivo: Gris -> Blanco
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    {/* FONDO "GLITCH" (Solo visible al Hover o Activo) */}
                    <span className={`
                      absolute inset-0 transform -skew-x-12 transition-all duration-300 border-r border-l border-white/5
                      ${isActive 
                        ? 'bg-white/5 border-zaun-green/30' // Fondo activo sutil
                        : 'bg-transparent hover:bg-white/5 border-transparent'
                      }
                    `}></span>

                    {/* ICONO (Sin rotación exagerada, solo un salto y color) */}
                    <item.icon 
                      size={18} 
                      className={`
                        relative z-10 transition-all duration-200
                        ${isActive 
                          ? 'text-zaun-green drop-shadow-[0_0_5px_#0aff60]' 
                          : 'group-hover:text-jinx-pink group-hover:-translate-y-0.5' // Toque rosa al pasar mouse
                        }
                      `} 
                    />
                    
                    {/* TEXTO (Cambia de fuente al activarse: Caos controlado) */}
                    <span className={`
                      relative z-10 tracking-widest text-sm transition-all duration-200
                      ${isActive 
                        ? 'font-marker text-lg mt-1' // Fuente Graffiti + un poco más grande
                        : 'font-bold font-roboto group-hover:tracking-[0.15em]' // Efecto de estiramiento al hover
                      }
                    `}>
                      {item.name}
                    </span>

                    {/* INDICADOR INFERIOR (Estilo "Cinta Adhesiva" mal puesta) */}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.75 bg-jinx-pink shadow-[0_0_8px_#ff2a6d] transform skew-x-12"></span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* 3. BOTÓN DE ACCIÓN (Estilo Peligro Industrial) */}
          <div className="hidden md:flex items-center pl-4 border-l border-gray-700 h-8">
            <button className="relative group overflow-hidden px-4 py-1 bg-[#F4D03F] border-2 border-black transform -skew-x-12 hover:skew-x-0 transition-transform duration-200">
              
              {/* Rayas de peligro (Overlay) */}
              <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,#000,#000_5px,transparent_5px,transparent_10px)]"></div>
              
              <div className="relative flex items-center gap-2 transform skew-x-12 group-hover:skew-x-0 transition-transform">
                <Zap size={16} className="text-black fill-black" />
                <span className="font-black text-xs text-black tracking-widest">
                   NUEVOS LANZAMIENTOS
                </span>
              </div>

              {/* Destello blanco al pasar mouse */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-30 transition-opacity"></div>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default NavBar;
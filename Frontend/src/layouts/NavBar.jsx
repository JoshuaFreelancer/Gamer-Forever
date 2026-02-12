import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, Monitor, Briefcase, Zap } from 'lucide-react';

const NavBar = () => {
  // Definimos los items en un array para mantener el código limpio (DRY)
  const navItems = [
    { name: 'INICIO', path: '/', icon: Home },
    { name: 'CATEGORÍAS', path: '/categories', icon: Grid },
    { name: 'PLATAFORMAS', path: '/platforms', icon: Monitor }, // Cambio sugerido: "Plataformas" suena más gamer que "Dispositivos"
    { name: 'DESARROLLADORES', path: '/developers', icon: Briefcase },
  ];

  return (
    // 'top-20' es porque el Header mide h-20. Así se pega justo debajo.
    <nav className="sticky top-20 z-40 w-full bg-black/90 backdrop-blur-sm border-b border-white/5 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center md:justify-start overflow-x-auto no-scrollbar">
          
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                relative group flex items-center gap-2 px-6 py-4 text-sm font-bold tracking-widest transition-all duration-300
                ${isActive 
                  ? 'text-neon-green bg-white/5' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {/* Icono con efecto de brillo si está activo */}
                  <item.icon 
                    size={16} 
                    className={`transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_5px_rgba(0,255,105,0.8)]' : 'group-hover:scale-110'}`} 
                  />
                  
                  {/* Texto */}
                  <span className={isActive ? 'drop-shadow-[0_0_5px_rgba(0,255,105,0.5)]' : ''}>
                    {item.name}
                  </span>

                  {/* Línea inferior animada (Cyberpunk Style) */}
                  <span className={`
                    absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-neon-green to-transparent
                    transition-transform duration-300 origin-center
                    ${isActive ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-50 group-hover:opacity-50'}
                  `}></span>
                  
                  {/* Pequeño detalle decorativo en las esquinas si está activo */}
                  {isActive && (
                    <>
                      <span className="absolute top-0 left-0 w-1 h-1 bg-neon-green shadow-[0_0_5px_#00FF69]"></span>
                      <span className="absolute top-0 right-0 w-1 h-1 bg-neon-green shadow-[0_0_5px_#00FF69]"></span>
                    </>
                  )}
                </>
              )}
            </NavLink>
          ))}

          {/* Botón Extra: Ofertas / Destacados (Opcional, para romper la monotonía) */}
          <div className="hidden md:flex ml-auto items-center">
            <button className="flex items-center gap-2 text-neon-pink text-xs font-bold px-3 py-1 border border-neon-pink/30 rounded hover:bg-neon-pink hover:text-white transition-all">
              <Zap size={14} className="fill-current" />
              NUEVOS LANZAMIENTOS
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default NavBar;
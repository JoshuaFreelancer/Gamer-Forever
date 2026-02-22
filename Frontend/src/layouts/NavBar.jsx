import { NavLink } from "react-router-dom";
import { Home, Grid, Monitor, Briefcase, Zap } from "lucide-react";

const NavBar = () => {
  const navItems = [
    { name: "INICIO", path: "/", icon: Home },
    { name: "CATEGORÍAS", path: "/categories", icon: Grid },
    { name: "PLATAFORMAS", path: "/platforms", icon: Monitor },
    { name: "DESARROLLADORES", path: "/developers", icon: Briefcase },
  ];

  return (
    <nav className="relative w-full bg-void-purple border-b-2 border-gray-800 shadow-xl overflow-hidden">
      {/* 1. FONDO CAÓTICO (Sutil) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(90deg,#000,#000_2px,transparent_2px,transparent_40px)]"></div>
        <div className="absolute top-0 w-full h-px bg-linear-to-r from-transparent via-jinx-pink to-transparent opacity-50"></div>
      </div>

      <div className="relative max-w-350 mx-auto px-0 md:px-6">
        <div className="flex items-center justify-between h-14">
          {/* 2. GRUPO DE NAVEGACIÓN (Scrollable en móvil) */}
          <div className="flex items-center h-full gap-1 md:gap-2 overflow-x-auto flex-nowrap w-full px-4 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                // 🚀 SOLUCIÓN AL CORTE: Añadimos 'first:ml-3 md:first:ml-4'
                // Esto empuja solo al primer botón un poquito a la derecha para que el "skew" no choque con la pared.
                className={({ isActive }) => `
                  relative h-full flex items-center gap-2 md:gap-3 px-4 md:px-6 transition-colors duration-200 group shrink-0
                  first:ml-3 md:first:ml-4
                  ${isActive ? "text-zaun-green" : "text-gray-400 hover:text-white"}
                `}
              >
                {({ isActive }) => (
                  <>
                    {/* FONDO "GLITCH" */}
                    <span
                      className={`
                      absolute inset-0 transform -skew-x-12 transition-colors duration-300 border-r border-l border-white/5
                      ${isActive ? "bg-white/5 border-zaun-green/30" : "bg-transparent hover:bg-white/5 border-transparent"}
                    `}
                    ></span>

                    {/* ICONO */}
                    <item.icon
                      size={18}
                      className={`
                        relative z-10 transition-transform duration-200 will-change-transform
                        ${
                          isActive
                            ? "text-zaun-green drop-shadow-[0_0_5px_#0aff60]"
                            : "group-hover:text-jinx-pink group-hover:-translate-y-0.5"
                        }
                      `}
                    />

                    {/* TEXTO */}
                    <span
                      className={`
                      relative z-10 transition-all duration-200
                      ${
                        isActive
                          ? "font-marker text-md md:text-lg mt-1 tracking-widest"
                          : "font-bold font-roboto text-xs md:text-sm tracking-wide group-hover:tracking-[0.15em]"
                      }
                    `}
                    >
                      {item.name}
                    </span>

                    {/* INDICADOR INFERIOR */}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-1 bg-jinx-pink shadow-[0_0_8px_#ff2a6d] transform skew-x-12"></span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* 3. BOTÓN DE ACCIÓN (Oculto en móvil para no estorbar el scroll) */}
          <div className="hidden lg:flex items-center pl-4 border-l border-gray-700 h-8 shrink-0">
            <button className="relative group overflow-hidden px-4 py-1 bg-[#F4D03F] border-2 border-black transform -skew-x-12 hover:skew-x-0 transition-transform duration-200 will-change-transform">
              <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,#000,#000_5px,transparent_5px,transparent_10px)]"></div>

              <div className="relative flex items-center gap-2 transform skew-x-12 group-hover:skew-x-0 transition-transform will-change-transform">
                <Zap size={16} className="text-black fill-black" />
                <span className="font-black text-xs text-black tracking-widest">
                  NUEVOS LANZAMIENTOS
                </span>
              </div>

              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-30 transition-opacity"></div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

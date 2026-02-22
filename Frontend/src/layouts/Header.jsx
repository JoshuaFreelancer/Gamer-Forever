import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, Menu, User, X, Zap } from "lucide-react";
import Logo from "../assets/images/logo_gamer_forever.webp";
import SearchBar from "../components/common/SearchBar";

// Rutas de exploración para el menú móvil (alineadas con tu Footer)
const EXPLORE_LINKS = [
  { name: "Catálogo", path: "/" },
  { name: "Categorías", path: "/categories" },
  { name: "Plataformas", path: "/platforms" },
  { name: "Desarrolladores", path: "/developers" },
];

const Header = () => {
  // 🚀 ESTADO PARA EL MENÚ MÓVIL
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // 🚀 Cerrar el menú automáticamente si la ruta cambia
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevenir scroll en el body cuando el menú está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-999 w-full isolate">
        {/* 1. FONDO CAÓTICO (SVG GRAFFITI) */}
        <div className="absolute inset-0 bg-void-purple z-0 border-b-4 border-jinx-pink shadow-lg overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,#000,#000_10px,transparent_10px,transparent_20px)]"></div>
          <svg
            className="absolute w-full h-full pointer-events-none"
            preserveAspectRatio="none"
          >
            <path
              d="M-50,80 Q 200,-50 500,100 T 1000,20"
              stroke="#ff2a6d"
              strokeWidth="10"
              fill="none"
              opacity="0.15"
            />
            <circle
              cx="90%"
              cy="10%"
              r="150"
              stroke="#0aff60"
              strokeWidth="4"
              fill="none"
              strokeDasharray="15,10"
              opacity="0.1"
            />
            <g stroke="#0aff60" strokeWidth="5" opacity="0.2">
              <path d="M 50,20 L 90,80 M 90,20 L 50,80" />
              <path d="M 600,10 L 620,30 M 620,10 L 600,30" strokeWidth="3" />
            </g>
            <path
              d="M 800,100 L 820,60 L 840,100 L 860,60 L 880,100"
              stroke="#ff2a6d"
              strokeWidth="3"
              fill="none"
              opacity="0.2"
            />
            <ellipse
              cx="50%"
              cy="50%"
              rx="300"
              ry="60"
              fill="black"
              opacity="0.3"
              filter="blur(40px)"
            />
          </svg>
        </div>

        {/* 2. CONTENEDOR DE ELEMENTOS */}
        {/* 🚀 Cambié px-6 a px-4 en móvil para dar aún más espacio */}
        <div className="relative max-w-350 mx-auto px-4 md:px-6 h-20 md:h-24 flex items-center justify-between gap-3 md:gap-4 z-10">
          {/* --- PIEZA 1: IDENTIDAD --- */}
          {/* 🚀 OPTIMIZACIÓN MÓVIL: hidden md:flex oculta el logo en pantallas pequeñas */}
          <Link
            to="/"
            className="hidden md:flex items-center gap-5 group relative select-none min-w-max"
          >
            <div className="relative ml-4">
              <div className="absolute inset-0 bg-jinx-pink transform rotate-6 scale-125 border-2 border-white z-0 transition-transform group-hover:rotate-12"></div>
              <img
                src={Logo}
                alt="Logo Gamer For`ever"
                className="h-14 w-auto object-contain relative z-10 -rotate-3 transition-transform group-hover:scale-110 brightness-0 invert drop-shadow-[2px_2px_0_#000]"
              />
            </div>
            <div className="hidden sm:flex flex-col relative z-20 ml-1">
              <div className="relative leading-none">
                <span className="absolute top-0 left-0 font-marker text-3xl text-jinx-pink tracking-widest translate-x-0.5 translate-y-0.5">
                  GAMER
                </span>
                <span className="relative font-marker text-3xl text-white tracking-widest">
                  GAMER
                </span>
              </div>
              <div className="relative inline-block -mt-1 ml-4 transform -rotate-2 self-start">
                <span className="font-extrabold text-xs tracking-[0.2em] text-black bg-zaun-green border border-black px-4 py-0.5 shadow-[2px_2px_0_#000]">
                  FOREVER
                </span>
              </div>
            </div>
          </Link>

          {/* --- PIEZA 2: BUSCADOR --- */}
          <div className="flex-1 flex justify-center z-20">
            <SearchBar />
          </div>

          {/* --- PIEZA 3: ZONA DE USUARIO --- */}
          {/* 🚀 Cambié el gap para que quede más compacto en móvil */}
          <div className="flex items-center gap-3 md:gap-6 min-w-max">
            {/* 🚀 OPTIMIZACIÓN MÓVIL: hidden md:block oculta la campana en móvil */}
            <button className="hidden md:block relative group hover:scale-105 transition-transform will-change-transform">
              <div className="absolute inset-0 bg-black rotate-45 border-2 border-gray-600 group-hover:border-jinx-pink transition-colors shadow-[2px_2px_0_rgba(0,0,0,0.5)]"></div>
              <div className="relative p-2.5 z-10">
                <Bell
                  size={20}
                  className="text-gray-300 group-hover:text-white transition-colors"
                />
              </div>
              <div className="absolute -top-1 -right-1 bg-zaun-green text-black font-bold text-[10px] w-4 h-4 flex items-center justify-center border border-black z-20 shadow-[1px_1px_0_#000]">
                !
              </div>
            </button>

            {/* Avatar del usuario (Visible en móvil) */}
            <Link to="/profile" className="flex items-center gap-4 group">
              <div className="text-right hidden md:block">
                <span className="block font-marker text-xl text-white leading-none group-hover:text-jinx-pink transition-colors">
                  GUEST
                </span>
                <div className="h-1.5 w-full bg-jinx-pink mt-1 border border-black transform -skew-x-12 shadow-[2px_2px_0_#000]"></div>
              </div>
              <div className="relative w-10 h-10 md:w-12 md:h-12">
                <div className="absolute inset-0 bg-black translate-x-1 translate-y-1 rotate-3"></div>
                <div className="absolute inset-0 bg-gray-200 border-2 border-white flex items-center justify-center overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-200 will-change-transform">
                  <User size={24} className="text-black" />
                </div>
                <div className="absolute -top-2 -left-2 w-5 h-2.5 md:w-6 md:h-3 bg-[#e4c95e] border border-black transform -rotate-45 shadow-sm z-20 opacity-90"></div>
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm bg-zaun-green border border-black z-10"></div>
              </div>
            </Link>

            {/* 🚀 Menú Hamburguesa FUNCIONAL */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden bg-black border-2 border-zaun-green p-1.5 text-zaun-green hover:bg-zaun-green hover:text-black transition-colors shadow-[4px_4px_0_rgba(10,255,96,0.5)] active:translate-y-1 active:shadow-none"
            >
              <Menu size={24} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================
          3. OVERLAY MENÚ MÓVIL (PANTALLA COMPLETA)
      ======================================================================== */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-100 bg-gray-950/95 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-200">
          {/* Botón de cierre radical */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-6 right-6 bg-jinx-pink p-2 border-2 border-black text-white shadow-[4px_4px_0_#000] active:translate-y-1 active:shadow-none"
          >
            <X size={32} strokeWidth={3} />
          </button>

          <div className="flex flex-col items-center gap-8 w-full px-8">
            <h2 className="font-marker text-4xl text-white tracking-widest mb-4 flex items-center gap-2 border-b-4 border-zaun-green pb-2">
              <Zap className="text-jinx-pink" size={32} />
              NAVEGACIÓN
            </h2>

            {EXPLORE_LINKS.map((link, idx) => (
              <Link
                key={link.name}
                to={link.path}
                className="w-full relative group block text-center"
              >
                <div className="absolute inset-0 bg-zaun-green transform skew-x-[-10deg] opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <span className="relative z-10 font-black text-2xl uppercase tracking-widest text-gray-300 group-hover:text-black transition-colors py-4 block">
                  {link.name}
                </span>
                {/* Línea divisoria */}
                {idx !== EXPLORE_LINKS.length - 1 && (
                  <div className="h-px w-1/2 mx-auto bg-gray-800 mt-2"></div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

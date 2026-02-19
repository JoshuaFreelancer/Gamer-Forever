import { Link } from "react-router-dom";
import { Bell, Menu, User } from "lucide-react";
import Logo from "../assets/images/logo_gamer_forever.png";
import SearchBar from "../components/common/SearchBar"; // Asegúrate de que la ruta sea correcta

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full isolate">
      {/* ========================================================================
          1. FONDO CAÓTICO (SVG GRAFFITI) - INTACTO
      ======================================================================== */}
      <div className="absolute inset-0 bg-void-purple z-0 border-b-4 border-jinx-pink shadow-lg overflow-hidden">
        {/* A. Textura de Rayas Industriales (Muy sutil) */}
        <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,#000,#000_10px,transparent_10px,transparent_20px)]"></div>

        {/* B. CAPA DE GRAFFITI SVG (EL CAOS DE JINX) */}
        <svg
          className="absolute w-full h-full pointer-events-none"
          preserveAspectRatio="none"
        >
          {/* 1. Rayón Rosa Gigante (Curva Bezier agresiva) */}
          <path
            d="M-50,80 Q 200,-50 500,100 T 1000,20"
            stroke="#ff2a6d"
            strokeWidth="10"
            fill="none"
            opacity="0.15"
          />

          {/* 2. Círculo Tóxico Punteado (Derecha) */}
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

          {/* 3. Las "X" de Jinx (Izquierda y Centro) */}
          <g stroke="#0aff60" strokeWidth="5" opacity="0.2">
            <path d="M 50,20 L 90,80 M 90,20 L 50,80" /> {/* X grande izq */}
            <path
              d="M 600,10 L 620,30 M 620,10 L 600,30"
              strokeWidth="3"
            />{" "}
            {/* X pequeña centro */}
          </g>

          {/* 4. Zigzag Eléctrico (Abajo Derecha) */}
          <path
            d="M 800,100 L 820,60 L 840,100 L 860,60 L 880,100"
            stroke="#ff2a6d"
            strokeWidth="3"
            fill="none"
            opacity="0.2"
          />

          {/* 5. Mancha de Pintura Negra (Fondo del buscador) */}
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

      {/* ========================================================================
          2. CONTENEDOR DE ELEMENTOS (FRONTAL)
      ======================================================================== */}
      {/* Nota: Corregí max-w-350 a max-w-[1400px] para que se vea bien en escritorio */}
      <div className="relative max-w-350 mx-auto px-6 h-24 flex items-center justify-between gap-4 z-10">
        {/* --- PIEZA 1: IDENTIDAD --- */}
        <Link
          to="/"
          className="flex items-center gap-5 group relative select-none min-w-max"
        >
          <div className="relative ml-4">
            <div className="absolute inset-0 bg-jinx-pink transform rotate-6 scale-125 border-2 z-0 transition-transform group-hover:rotate-12"></div>
            <img
              src={Logo}
              alt="Logo Gamer Forever"
              className="h-14 w-auto object-contain relative z-10 -rotate-3 transition-transform group-hover:scale-110"
              style={{
                filter:
                  "brightness(0) invert(1) drop-shadow(2px 2px 0px rgba(0,0,0,1))",
              }}
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

        {/* --- PIEZA 2: BUSCADOR FUNCIONAL (Integrado) --- */}
        <div className="flex-1 flex justify-center z-20">
          {/* El componente SearchBar ya trae los estilos de skew, colores y capas internamente */}
          <SearchBar />
        </div>

        {/* --- PIEZA 3: ZONA DE USUARIO --- */}
        <div className="flex items-center gap-6 min-w-max">
          <button className="relative group hover:scale-105 transition-transform">
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

          <Link to="/profile" className="flex items-center gap-4 group">
            <div className="text-right hidden md:block">
              <span className="block font-marker text-xl text-white leading-none group-hover:text-jinx-pink transition-colors">
                GUEST
              </span>
              <div className="h-1.5 w-full bg-jinx-pink mt-1 border border-black transform -skew-x-12 shadow-[2px_2px_0_#000]"></div>
            </div>

            <div className="relative w-12 h-12">
              <div className="absolute inset-0 bg-black translate-x-1 translate-y-1 rotate-3"></div>
              <div className="absolute inset-0 bg-gray-200 border-2 border-white flex items-center justify-center overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-200">
                <User size={28} className="text-black" />
              </div>
              <div className="absolute -top-2 -left-2 w-6 h-3 bg-[#e4c95e] border border-black transform -rotate-45 shadow-sm z-20 opacity-90"></div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-sm bg-zaun-green border border-black z-10"></div>
            </div>
          </Link>

          <button className="md:hidden bg-black border-2 border-zaun-green p-1.5 text-zaun-green hover:bg-zaun-green hover:text-black transition-colors shadow-[4px_4px_0_rgba(10,255,96,0.5)]">
            <Menu size={28} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

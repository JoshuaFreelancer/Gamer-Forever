import { Link } from "react-router-dom";
import {
  X,
  Instagram,
  Facebook,
  Youtube,
  Twitch,
  ExternalLink,
  Zap,
} from "lucide-react";
import Logo from "/apple-touch-icon.png";

// 🚀 RUTAS A PRUEBA DE FALLOS
const EXPLORE_LINKS = [
  { name: "Inicio", path: "/" },
  { name: "Categorías", path: "/categories" },
  { name: "Plataformas", path: "/platforms" },
  { name: "Desarrolladores", path: "/developers" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-void-purple border-t-4 border-jinx-pink overflow-hidden text-white isolate">
      {/* 1. FONDO DE ARTE CALLEJERO (AISLADO) */}
      {/* 🚀 SOLUCIÓN: transform-gpu aísla este SVG pesado en su propia textura estática */}
      <div className="absolute inset-0 z-0 pointer-events-none transform-gpu">
        <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(45deg,#000,#000_2px,transparent_2px,transparent_8px)]"></div>
        <svg
          className="absolute w-full h-full opacity-20"
          preserveAspectRatio="none"
        >
          <path
            d="M-100,50 Q 400,150 800,-50 T 1600,100"
            stroke="#ff2a6d"
            strokeWidth="30"
            fill="none"
            opacity="0.1"
            strokeLinecap="round"
          />
          <g stroke="#0aff60" strokeWidth="4" strokeLinecap="round">
            <path d="M 50,50 L 80,80 M 80,50 L 50,80" opacity="0.4" />
            <path
              d="M 90,80 L 92,85 M 92,80 L 90,85"
              strokeWidth="3"
              opacity="0.3"
            />
          </g>
          <path
            d="M 600,100 A 50,50 0 1,0 700,150"
            stroke="#ff2a6d"
            strokeWidth="2"
            fill="none"
            strokeDasharray="10,15"
            opacity="0.3"
          />
          <path
            d="M 1100,50 L 1150,20 M 1150,20 L 1140,60"
            stroke="#0aff60"
            strokeWidth="3"
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity="0.4"
          />
          <path
            d="M 200,150 L 220,100 L 240,160 L 260,110 L 280,150"
            stroke="#ff2a6d"
            strokeWidth="2"
            fill="none"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* 2. CONTENIDO PRINCIPAL */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
          {/* COLUMNA 1: MARCA */}
          <div className="flex flex-col space-y-4 md:space-y-6 items-center md:items-start text-center md:text-left">
            {/* 🚀 SOLUCIÓN: transform-gpu protege el logo */}
            <Link
              to="/"
              className="flex items-center gap-3 md:gap-5 group select-none w-fit shrink-0 transform-gpu"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-jinx-pink transform rotate-6 scale-110 border-2 border-white z-0 transition-transform group-hover:rotate-12"></div>
                <img
                  src={Logo}
                  alt="Logo Gamer Forever"
                  className="h-10 md:h-14 w-auto object-contain relative z-10 -rotate-3 transition-transform group-hover:scale-105 drop-shadow-[1px_1px_0_#000]"
                />
              </div>

              <div className="flex flex-col relative z-20">
                <div className="relative leading-none">
                  <span className="absolute top-0 left-0 font-marker text-2xl md:text-3xl text-jinx-pink tracking-widest translate-x-0.5 translate-y-0.5">
                    GAMER
                  </span>
                  <span className="relative font-marker text-2xl md:text-3xl text-white tracking-widest">
                    GAMER
                  </span>
                </div>
                <div className="relative inline-block -mt-1 ml-4 transform -rotate-2 self-start">
                  <span className="font-extrabold text-[10px] md:text-xs tracking-[0.2em] text-black bg-zaun-green border border-black px-2 md:px-4 py-0.5 shadow-[2px_2px_0_#000]">
                    FOREVER
                  </span>
                </div>
              </div>
            </Link>

            <p className="text-gray-400 text-xs md:text-sm leading-relaxed max-w-sm font-roboto border-l-2 border-zaun-green pl-4">
              Tu base de datos definitiva. Noticias, guías y el catálogo más
              extenso de videojuegos. Sin filtros, sin pausas, solo gaming.
            </p>
          </div>

          {/* COLUMNA 2: NAVEGACIÓN */}
          <div className="flex flex-col items-center md:items-start md:pl-10">
            <h2 className="font-marker text-lg md:text-xl text-white mb-4 md:mb-6 tracking-widest flex items-center gap-2">
              <Zap size={18} className="text-jinx-pink" /> EXPLORAR
            </h2>
            <ul className="space-y-3 flex flex-col items-center md:items-start w-full">
              {EXPLORE_LINKS.map((item) => (
                <li key={item.name}>
                  {/* 🚀 SOLUCIÓN: transform-gpu y limpieza de will-change */}
                  <Link
                    to={item.path}
                    className="text-gray-400 hover:text-zaun-green transition-all duration-200 flex items-center gap-2 group p-2 md:p-0 transform-gpu"
                  >
                    <span className="block w-1 h-1 bg-gray-600 group-hover:bg-zaun-green transition-colors shrink-0"></span>
                    <span className="uppercase font-bold text-xs tracking-wider md:group-hover:translate-x-1 transition-transform">
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMNA 3: COMUNIDAD */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="font-marker text-lg md:text-xl text-white mb-4 md:mb-6 tracking-widest flex items-center gap-2">
              <span className="block w-2 h-2 bg-zaun-green shrink-0"></span>{" "}
              COMUNIDAD
            </h2>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <SocialBtn
                icon={X}
                href="https://twitter.com"
                color="hover:bg-black hover:text-white hover:border-white"
                label="X (Twitter)"
              />
              <SocialBtn
                icon={Instagram}
                href="https://instagram.com"
                color="hover:bg-gradient-to-tr hover:from-purple-500 hover:to-orange-500 hover:text-white"
                label="Instagram"
              />
              <SocialBtn
                icon={Facebook}
                href="https://facebook.com"
                color="hover:bg-[#1877F2] hover:text-white"
                label="Facebook"
              />
              <SocialBtn
                icon={Twitch}
                href="https://twitch.tv"
                color="hover:bg-[#9146FF] hover:text-white"
                label="Twitch"
              />
              <SocialBtn
                icon={Youtube}
                href="https://youtube.com"
                color="hover:bg-[#FF0000] hover:text-white"
                label="Youtube"
              />
            </div>

            <div className="mt-6 md:mt-8 opacity-40 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shrink-0 transform-gpu"></div>
              <span className="text-[10px] font-mono tracking-[0.2em] text-zaun-green">
                ESTADO: ONLINE
              </span>
            </div>
          </div>
        </div>

        {/* BARRA INFERIOR */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left text-[10px] md:text-xs text-gray-500 gap-4 md:gap-0 font-mono uppercase tracking-wide">
          <p className="flex items-center justify-center gap-2 w-full md:w-auto">
            &copy; {currentYear}{" "}
            <span className="text-white font-bold">GAMER FOREVER</span>.{" "}
            <br className="md:hidden" />
            <span className="hidden md:inline">
              Todos los derechos reservados.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 w-full md:w-auto justify-center md:justify-end">
            {/* 🚀 SOLUCIÓN: Aislamiento en los enlaces finales */}
            <a
              href="https://rawg.io/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-white transition-colors p-2 md:p-0 transform-gpu"
            >
              Datos de RAWG <ExternalLink size={10} />
            </a>
            <span className="flex items-center gap-1 p-2 md:p-0">
              Desarrollado por{" "}
              <a
                href="https://joshuafreelancer.github.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-bold hover:text-zaun-green transition-colors transform-gpu inline-block"
              >
                Joshua Freelancer
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// 🚀 SOLUCIÓN: Limpieza de will-change e inyección de transform-gpu en el botón social
const SocialBtn = ({ icon: Icon, href, color, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    aria-label={label}
    className={`relative group w-10 h-10 flex items-center justify-center bg-[#240046] border border-gray-600 transition-all duration-300 transform-gpu ${color}`}
    style={{
      clipPath:
        "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
    }}
  >
    <Icon
      size={18}
      className="text-gray-300 group-hover:scale-110 transition-transform duration-200"
    />
  </a>
);

export default Footer;

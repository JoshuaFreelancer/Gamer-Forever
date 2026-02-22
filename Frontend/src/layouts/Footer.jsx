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
import Logo from "../assets/images/logo_gamer_forever.webp";

// 🚀 RUTAS A PRUEBA DE FALLOS: Asegura que los links del footer funcionen con el enrutador
const EXPLORE_LINKS = [
  { name: "Catálogo", path: "/" },
  { name: "Categorías", path: "/categories" },
  { name: "Plataformas", path: "/platforms" },
  { name: "Desarrolladores", path: "/developers" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-void-purple border-t-4 border-jinx-pink overflow-hidden text-white">
      {/* 1. FONDO DE ARTE CALLEJERO */}
      <div className="absolute inset-0 z-0 pointer-events-none">
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
      <div className="relative max-w-350 mx-auto px-6 py-12 z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* COLUMNA 1: MARCA */}
          <div className="flex flex-col space-y-6">
            <Link
              to="/"
              className="flex items-center gap-5 group select-none w-fit"
            >
              <div className="relative ml-2">
                <div className="absolute inset-0 bg-jinx-pink transform rotate-6 scale-110 border-2 border-white z-0 transition-transform group-hover:rotate-12"></div>
                {/* 🚀 OPTIMIZACIÓN: Tailwind CSS nativo en lugar de inline styles */}
                <img
                  src={Logo}
                  alt="Logo Gamer Forever"
                  className="h-14 w-auto object-contain relative z-10 -rotate-3 transition-transform group-hover:scale-105 brightness-0 invert drop-shadow-[2px_2px_0_#000]"
                />
              </div>

              <div className="flex flex-col relative z-20 ml-1">
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

            <p className="text-gray-400 text-sm leading-relaxed max-w-sm font-roboto border-l-2 border-zaun-green pl-4">
              Tu base de datos definitiva. Noticias, guías y el catálogo más
              extenso de videojuegos. Sin filtros, sin pausas, solo gaming.
            </p>
          </div>

          {/* COLUMNA 2: NAVEGACIÓN */}
          <div className="flex flex-col md:pl-10">
            <h2 className="font-marker text-xl text-white mb-6 tracking-widest flex items-center gap-2">
              <Zap size={18} className="text-jinx-pink" /> EXPLORAR
            </h2>
            <ul className="space-y-3">
              {/* 🚀 CORRECCIÓN: Usando el arreglo exacto para no generar 404s */}
              {EXPLORE_LINKS.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-gray-400 hover:text-zaun-green transition-all duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-gray-600 group-hover:bg-zaun-green transition-colors"></span>
                    <span className="uppercase font-bold text-xs tracking-wider group-hover:translate-x-1 transition-transform will-change-transform">
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMNA 3: COMUNIDAD */}
          <div className="flex flex-col">
            <h2 className="font-marker text-xl text-white mb-6 tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-zaun-green"></span> COMUNIDAD
            </h2>

            <div className="flex flex-wrap gap-3">
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

            <div className="mt-8 opacity-40 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-mono tracking-[0.2em] text-zaun-green">
                ESTADO: ONLINE
              </span>
            </div>
          </div>
        </div>

        {/* BARRA INFERIOR */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs text-gray-500 gap-4 font-mono uppercase tracking-wide">
          <p className="flex items-center gap-2">
            &copy; {currentYear}{" "}
            <span className="text-white font-bold">GAMER FOREVER</span>. Todos
            los derechos reservados.
          </p>
          <div className="flex items-center gap-4 md:gap-6">
            <a
              href="https://rawg.io/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              Datos de RAWG <ExternalLink size={10} />
            </a>
            <span className="flex items-center gap-1">
              Desarrollado por{" "}
              <span className="text-white font-bold">Joshua Freelancer</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Componente Botón Social
const SocialBtn = ({ icon: Icon, href, color, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    aria-label={label}
    className={`relative group w-10 h-10 flex items-center justify-center bg-[#240046] border border-gray-600 transition-all duration-300 ${color}`}
    style={{
      clipPath:
        "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
    }}
  >
    <Icon
      size={18}
      className="text-gray-300 group-hover:scale-110 transition-transform duration-200 will-change-transform"
    />
  </a>
);

export default Footer;

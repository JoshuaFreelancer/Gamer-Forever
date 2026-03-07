import { FaDiscord } from "react-icons/fa";
import { ArrowRight, MessageCircle } from "lucide-react";

// Assets
import PinkPaint from "../../assets/images/pink_paint.webp";
import XGreen from "../../assets/images/X_green.webp";
import SplatterGreen from "../../assets/images/splatter_green.webp";

const DiscordBanner = () => {
  return (
    // 🚀 MOBILE-FIRST: py-12 en móvil, py-20 en escritorio. 
    <section className="relative w-full py-12 md:py-20 overflow-hidden bg-void-purple border-y-4 border-black group isolate">
      {/* 1. FONDO MURAL CAÓTICO */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,#000_0,#000_2px,transparent_2px,transparent_10px)]" />

        <img
          src={PinkPaint}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute -top-20 -left-20 w-125 opacity-[0.06] rotate-12"
        />
        <img
          src={PinkPaint}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute -bottom-40 -right-20 w-150 opacity-[0.04] -rotate-45"
        />
        <img
          src={SplatterGreen}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute top-10 right-[20%] w-64 opacity-15 rotate-90 blur-[1px]"
        />
      </div>

      {/* 2. CONTENIDO PRINCIPAL */}
      {/* 🚀 gap-8 en móvil para no separar tanto el texto del logo, gap-12 en PC */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
        
        {/* TEXTO (Izquierda) */}
        <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start w-full">
          <div className="inline-flex mb-4 px-3 py-1 bg-zaun-green border-2 border-black shadow-[4px_4px_0_#000] rotate-2">
            <span className="font-bold text-black tracking-widest text-xs md:text-sm flex items-center gap-2">
              <MessageCircle size={16} /> COMUNIDAD OFICIAL
            </span>
          </div>

          {/* 🚀 Tipografía fluida: text-4xl en móviles pequeños, subiendo a 7xl en PC */}
          <h2 className="font-marker text-4xl sm:text-5xl md:text-7xl text-white mb-4 md:mb-6 leading-[0.9] drop-shadow-[2px_2px_0_#000] md:drop-shadow-[4px_4px_0_#000]">
            ÚNETE A LA <br />
            <span className="text-jinx-pink text-stroke-black">
              RESISTENCIA
            </span>
          </h2>

          <p className="font-roboto text-gray-300 text-base md:text-xl max-w-xl mb-6 md:mb-8 leading-relaxed text-balance">
            No juegues solo. Únete a un servidor creado por jugadores para
            jugadores. Comparte tus clips, encuentra escuadrón y participa en
            torneos.
            <br className="hidden sm:block" />
            <span className="text-zaun-green font-bold">
              {" "}
              ¡El caos te espera!
            </span>
          </p>

          {/* BOTÓN DE ACCIÓN (Estilo Cartel) */}
          {/* 🚀 w-full en móvil con justify-center para que sea un bloque fácil de tocar. Reducimos el padding en móvil. */}
          <a
            href="https://discord.com/invite/WwXkCGHjBx"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full sm:w-auto justify-center items-center gap-2 md:gap-3 px-4 py-3 md:px-8 md:py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-black tracking-widest text-base md:text-xl border-2 border-black shadow-[4px_4px_0_#000] md:shadow-[6px_6px_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-[background-color,transform,box-shadow] duration-200 md:-skew-x-3 md:hover:skew-x-0 will-change-transform group/btn"
          >
            <FaDiscord className="w-6 h-6 md:w-7 md:h-7" />
            ENTRAR AL DISCORD
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover/btn:translate-x-1 transition-transform will-change-transform" />
          </a>
        </div>

        {/* ICONO DISCORD "VANDALIZADO" (Derecha) */}
        {/* 🚀 Reducido a w-48 h-48 en móvil para que no sea inmenso, w-80 h-80 en PC */}
        <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 flex items-center justify-center group/icon mt-4 md:mt-0 shrink-0">
          <div className="absolute inset-0 bg-black/30 rounded-full border-4 border-dashed border-gray-600 animate-spin-slow transform-gpu will-change-transform"></div>

          <FaDiscord className="w-full h-full text-[#5865F2] drop-shadow-[0_6px_0_#000] md:drop-shadow-[0_10px_0_#000] transform group-hover/icon:scale-110 transition-transform duration-300 will-change-transform p-4 md:p-0" />

          {/* Equis y sonrisa mantienen sus posiciones relativas gracias al % */}
          <img
            src={XGreen}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute top-[25%] left-[18%] w-12 sm:w-16 md:w-20 opacity-90 rotate-[-10deg] drop-shadow-md pointer-events-none"
          />
          <img
            src={XGreen}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute top-[25%] right-[18%] w-12 sm:w-16 md:w-20 opacity-90 rotate-10 drop-shadow-md pointer-events-none"
          />

          <svg
            className="absolute bottom-[20%] w-24 sm:w-32 h-12 sm:h-16 pointer-events-none"
            viewBox="0 0 100 50"
          >
            <path
              d="M10,10 Q50,60 90,10"
              fill="none"
              stroke="#0aff60"
              strokeWidth="5"
              strokeLinecap="round"
              className="drop-shadow-sm opacity-80"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default DiscordBanner;
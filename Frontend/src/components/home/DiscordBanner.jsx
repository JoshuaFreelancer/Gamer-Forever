import { FaDiscord } from 'react-icons/fa';
import { ArrowRight, MessageCircle } from 'lucide-react';

// Assets
import PinkPaint from '../../assets/images/pink_paint.png';
import XGreen from '../../assets/images/X_green.png';
import SplatterGreen from '../../assets/images/splatter_green.png';

const DiscordBanner = () => {
  return (
    <section className="relative w-full py-20 overflow-hidden bg-void-purple border-y-4 border-black group isolate">
      
      {/* 1. FONDO MURAL CAÓTICO (Súper Optimizado) */}
      {/* 🚀 Aislamos toda la capa de fondo en la GPU para que las animaciones superiores no repinten esto */}
      <div className="absolute inset-0 pointer-events-none select-none transform-gpu" style={{ willChange: 'transform' }}>
        
        {/* Textura base: Pasado a clase Tailwind, adiós style en línea */}
        <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,#000_0,#000_2px,transparent_2px,transparent_10px)]">
        </div>
        
        {/* Manchas de pintura: Sin mix-blend-screen, opacidad ajustada para que sea textura y no mancha */}
        <img 
          src={PinkPaint} 
          alt="" 
          loading="lazy"
          className="absolute -top-20 -left-20 w-125 opacity-[0.06] rotate-12" 
        />
        <img 
          src={PinkPaint} 
          alt="" 
          loading="lazy"
          className="absolute -bottom-40 -right-20 w-150 opacity-[0.04] -rotate-45" 
        />
        
        {/* Salpicadura Verde */}
        <img 
          src={SplatterGreen} 
          alt="" 
          loading="lazy"
          className="absolute top-10 right-[20%] w-64 opacity-15 rotate-90 blur-[1px]" 
        />
      </div>

      {/* 2. CONTENIDO PRINCIPAL */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* TEXTO (Izquierda) */}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-block mb-4 px-3 py-1 bg-zaun-green border-2 border-black shadow-[4px_4px_0_#000] rotate-2">
            <span className="font-bold text-black tracking-widest text-sm flex items-center gap-2">
              <MessageCircle size={16} /> COMUNIDAD OFICIAL
            </span>
          </div>
          
          <h2 className="font-marker text-5xl md:text-7xl text-white mb-6 leading-[0.9] drop-shadow-[4px_4px_0_#000]">
            ÚNETE A LA <br/>
            <span className="text-jinx-pink text-stroke-black">RESISTENCIA</span>
          </h2>
          
          <p className="font-roboto text-gray-300 text-lg md:text-xl max-w-xl mb-8 leading-relaxed">
            No juegues solo. Únete a un servidor creado por jugadores para jugadores. 
            Comparte tus clips, encuentra escuadrón y participa en torneos. 
            <span className="text-zaun-green font-bold"> ¡El caos te espera!</span>
          </p>

          {/* BOTÓN DE ACCIÓN (Estilo Cartel) */}
          <a 
            href="https://discord.com/invite/WwXkCGHjBx" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block relative group/btn"
          >
             {/* 🚀 OPTIMIZACIÓN: Transiciones específicas y will-change en lugar de transition-all */}
             <button className="relative px-8 py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-black tracking-widest text-xl border-2 border-black shadow-[6px_6px_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-[background-color,transform,box-shadow] duration-200 transform -skew-x-3 hover:skew-x-0 will-change-[transform,box-shadow]">
                <span className="flex items-center gap-3">
                   <FaDiscord size={28} />
                   ENTRAR AL DISCORD
                   <ArrowRight className="group-hover/btn:translate-x-1 transition-transform will-change-transform" />
                </span>
             </button>
          </a>
        </div>

        {/* ICONO DISCORD "VANDALIZADO" (Derecha) */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center group/icon">
            {/* Fondo circular detrás del logo */}
            {/* 🚀 OPTIMIZACIÓN: will-change-transform para la animación giratoria continua */}
            <div className="absolute inset-0 bg-black/30 rounded-full border-4 border-dashed border-gray-600 animate-spin-slow will-change-transform"></div>
            
            {/* Logo Discord Gigante */}
            {/* 🚀 OPTIMIZACIÓN: Transición específica para el hover del logo */}
            <FaDiscord className="w-full h-full text-[#5865F2] drop-shadow-[0_10px_0_#000] transform group-hover/icon:scale-110 transition-transform duration-300 will-change-transform" />
            
            {/* Ojos X Verdes */}
            <img 
               src={XGreen} 
               alt="" 
               loading="lazy"
               className="absolute top-[25%] left-[18%] w-16 md:w-20 opacity-90 rotate-[-10deg] drop-shadow-md pointer-events-none"
            />
            <img 
               src={XGreen} 
               alt="" 
               loading="lazy"
               className="absolute top-[25%] right-[18%] w-16 md:w-20 opacity-90 rotate-10 drop-shadow-md pointer-events-none"
            />
            
            {/* Sonrisa SVG */}
            <svg className="absolute bottom-[20%] w-32 h-16 pointer-events-none" viewBox="0 0 100 50">
                <path d="M10,10 Q50,60 90,10" fill="none" stroke="#0aff60" strokeWidth="5" strokeLinecap="round" className="drop-shadow-sm opacity-80" />
            </svg>
        </div>

      </div>
    </section>
  );
};

export default DiscordBanner;
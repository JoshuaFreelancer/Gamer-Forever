import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
} from "lucide-react";
import { Link } from "react-router-dom";
import GraffitiBrush from "../../assets/images/grafitti_pink_brush.webp";
import FallbackImage from "../../assets/images/pink_paint.webp";

import { getPlatformIcon } from "../../utils/platformIcons";
import { getResponsiveSrcSet } from "../../utils/imageCrop";

const Hero = ({ games }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // 🚀 ESTADO PARA DETECTAR MÓVIL: Lo usaremos para habilitar/deshabilitar el swipe
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile(); // Ejecutamos al montar
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleNext = useCallback(() => {
    if (!games || games.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % games.length);
  }, [games]);

  const handlePrev = useCallback(() => {
    if (!games || games.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + games.length) % games.length);
  }, [games]);

  // 🚀 LÓGICA DE COOLDOWN Y AUTOPLAY CONTINUO
  // Ya no se detiene por el hover. Al añadir `activeIndex` a las dependencias,
  // si el usuario cambia de imagen manualmente, el temporizador de 6 segundos se reinicia automáticamente.
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [handleNext, activeIndex]);

  if (!games || games.length === 0) return null;
  const activeGame = games[activeIndex];

  return (
    <div
      // 🚀 SOLUCIÓN HOVER: Cambiamos 'group' por 'group/hero' para no interferir con el botón interior
      className="relative w-full h-125 sm:h-150 md:h-175 bg-black overflow-hidden group/hero isolate"
    >
      {/* FONDO CINEMÁTICO */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={activeGame.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // 🚀 MEJORA: Transición más suave y ligeramente más lenta (0.8s) para un efecto cinematográfico
          transition={{ duration: 0.8, ease: "easeInOut" }}
          // 🚀 MAGIA CONDICIONAL: "drag" solo se activa si esMobile es true. En PC será 'false' y no hará nada.
          drag={isMobile ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, { offset }) => {
            if (offset.x < -50) handleNext(); // Deslizar a la izquierda
            if (offset.x > 50) handlePrev(); // Deslizar a la derecha
          }}
          className={`absolute inset-0 w-full h-full will-change-[opacity] ${
            isMobile ? "cursor-grab active:cursor-grabbing" : ""
          }`}
        >
          <img
            src={activeGame.background_image || FallbackImage}
            srcSet={
              activeGame.background_image
                ? getResponsiveSrcSet(activeGame.background_image)
                : undefined
            }
            sizes="(max-width: 768px) 200vw, (max-width: 1366px) 1280px, 100vw"
            alt={activeGame.name}
            className="w-full h-full object-cover object-top md:object-center opacity-80 pointer-events-none"
            loading="eager"
            decoding="sync"
          />
          <div className="absolute inset-0 bg-linear-to-t md:bg-linear-to-r from-black/90 via-black/50 to-transparent md:from-black/30 md:via-black/50 md:to-black/90 pointer-events-none" />
          <div className="absolute inset-0 bg-linear-to-t from-void-purple/90 via-transparent to-transparent opacity-80 md:opacity-100 pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* DECORACIÓN "JUEGOS DESTACADOS" */}
      <div className="absolute bottom-2 left-4 z-20 hidden md:block pointer-events-none">
        <div className="relative flex flex-col justify-center items-center w-md h-52">
          <img
            src={GraffitiBrush}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-contain scale-180 opacity-80 -rotate-3"
          />

          <div className="relative z-10 font-marker text-5xl -rotate-6 tracking-widest text-center -translate-y-4 -translate-x-6">
            <div className="absolute top-0.5 left-0.5 text-black z-0 select-none">
              <span className="block leading-none">JUEGOS</span>
              <span className="block leading-none mt-2">DESTACADOS</span>
            </div>

            <div className="relative z-10 select-none">
              <span className="text-zaun-green block leading-none">JUEGOS</span>
              <span className="text-white block leading-none mt-2">
                DESTACADOS
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* INFORMACIÓN DEL JUEGO */}
      <div className="absolute inset-0 flex items-end md:items-center justify-center md:justify-end px-4 md:px-16 pb-16 md:pb-0 z-20 pointer-events-none">
        <div className="w-full max-w-3xl text-center md:text-right flex flex-col items-center md:items-end gap-3 md:gap-4 pointer-events-auto">
          <motion.h1
            key={`title-${activeGame.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="font-marker text-4xl sm:text-5xl md:text-7xl text-white leading-tight md:leading-[0.9] drop-shadow-[2px_2px_0_#ff2a6d] md:drop-shadow-[4px_4px_0_#ff2a6d] text-balance"
          >
            {activeGame.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-2 md:gap-3 justify-center md:justify-end items-center"
          >
            <div className="flex items-center gap-2 px-3 py-1 bg-black/50 border border-gray-600 rounded skew-x-12">
              <Calendar size={14} className="text-gray-400 -skew-x-12" />
              <span className="text-sm font-bold text-gray-200 -skew-x-12">
                {activeGame.released?.split("-")[0]}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-zaun-green/20 border border-zaun-green rounded skew-x-12">
              <Star
                size={14}
                className="text-zaun-green fill-zaun-green -skew-x-12"
              />
              <span className="text-sm font-bold text-zaun-green -skew-x-12">
                {activeGame.rating} / 5
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center md:justify-end gap-3 md:gap-4 mt-2 md:mt-4"
          >
            {activeGame.parent_platforms?.map(({ platform }) => (
              <div
                key={platform.id}
                className="text-white hover:text-zaun-green transition-colors duration-200"
                title={platform.name}
              >
                {getPlatformIcon(platform.slug)}
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 md:mt-6 w-full sm:w-auto px-4 sm:px-0"
          >
            {/* 🚀 El botón sigue siendo su propio 'group', lo que arregla el bug del verde */}
            <Link
              to={`/game/${activeGame.id}`}
              className="group relative flex justify-center items-center gap-3 w-full sm:w-auto px-8 py-3 bg-jinx-pink text-white font-bold tracking-widest overflow-hidden transform skew-x-12 border-2 border-transparent hover:border-white transition-all shadow-md"
            >
              <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,#000,#000_8px,transparent_5px,transparent_15px)]"></div>
              <span className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-10 transition-opacity"></span>
              <span className="relative flex items-center justify-center gap-2 -skew-x-12 z-10 w-full">
                VER DETALLES <Gamepad2 size={20} />
              </span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* =========================================================
          🚀 CONTROLES
      ========================================================= */}
      {/* 🚀 Cambiado a group-hover/hero:opacity-100 para escuchar específicamente al contenedor padre */}
      <div className="absolute inset-x-0 bottom-4 md:bottom-8 z-30 flex flex-col items-center gap-4 md:gap-6 opacity-100 md:opacity-0 md:group-hover/hero:opacity-100 transition-opacity duration-300">
        <div className="hidden md:flex gap-20">
          <button
            onClick={handlePrev}
            className="p-2 text-white/70 hover:text-jinx-pink transition-colors hover:scale-110"
            aria-label="Anterior"
          >
            <ChevronLeft size={40} strokeWidth={3} />
          </button>
          <button
            onClick={handleNext}
            className="p-2 text-white/70 hover:text-zaun-green transition-colors hover:scale-110"
            aria-label="Siguiente"
          >
            <ChevronRight size={40} strokeWidth={3} />
          </button>
        </div>

        <div className="flex gap-2 md:gap-3">
          {games.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-1.5 rounded-full transition-colors duration-300 ${
                idx === activeIndex
                  ? "w-8 md:w-10 bg-zaun-green"
                  : "w-3 bg-gray-700 hover:bg-gray-500"
              }`}
              aria-label={`Ir a slide ${idx}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;

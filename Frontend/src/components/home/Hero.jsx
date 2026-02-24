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

// 🚀 IMPORTACIONES DE NUESTROS HELPERS CENTRALIZADOS
import { getPlatformIcon } from "../../utils/platformIcons";
import { getResponsiveSrcSet } from "../../utils/imageCrop";

const Hero = ({ games }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleNext = useCallback(() => {
    if (!games || games.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % games.length);
  }, [games]);

  const handlePrev = useCallback(() => {
    if (!games || games.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + games.length) % games.length);
  }, [games]);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [isHovered, handleNext]);

  if (!games || games.length === 0) return null;
  const activeGame = games[activeIndex];

  return (
    <div
      className="relative w-full h-150 md:h-175 bg-black overflow-hidden group isolate"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* FONDO CINEMÁTICO */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={activeGame.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "linear" }}
          className="absolute inset-0 w-full h-full will-change-[opacity]"
        >
          {/* 🚀 MAGIA RESPONSIVA: Entregamos la imagen perfecta para cada tamaño de pantalla */}
          <img
            src={activeGame.background_image || FallbackImage}
            srcSet={
              activeGame.background_image
                ? getResponsiveSrcSet(activeGame.background_image)
                : undefined
            }
            sizes="(max-width: 768px) 100vw, (max-width: 1366px) 1280px, 100vw"
            alt={activeGame.name}
            className="w-full h-full object-cover opacity-80"
            loading="eager"
            decoding="sync"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/30 via-black/50 to-black/90" />
          <div className="absolute inset-0 bg-linear-to-t from-void-purple/90 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* DECORACIÓN "JUEGOS DESTACADOS" */}
      <div className="absolute bottom-2 left-4 z-20 hidden md:block pointer-events-none">
        <div className="relative flex flex-col justify-center items-center w-md h-52">
          {/* 🚀 LA IMAGEN DECORATIVA PUEDE SER LAZY */}
          <img
            src={GraffitiBrush}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-contain scale-180 opacity-80 -rotate-3"
          />
          <div className="relative z-10 font-marker text-5xl -rotate-6 tracking-widest text-center -translate-y-4 -translate-x-6 drop-shadow-lg">
            <span className="text-zaun-green block leading-none">JUEGOS</span>
            <span className="text-white block leading-none mt-2">
              DESTACADOS
            </span>
          </div>
        </div>
      </div>

      {/* INFORMACIÓN DEL JUEGO */}
      <div className="absolute inset-0 flex items-center justify-end px-6 md:px-16 z-20 pointer-events-none">
        <div className="max-w-3xl text-right flex flex-col items-end gap-4 pointer-events-auto">
          <motion.h1
            key={`title-${activeGame.id}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="font-marker text-5xl md:text-7xl text-white leading-[0.9] drop-shadow-[4px_4px_0_#ff2a6d]"
          >
            {activeGame.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-3 justify-end items-center"
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
            className="flex flex-wrap justify-end gap-4 mt-4"
          >
            {/* 🚀 USO DEL HELPER CENTRALIZADO */}
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
            className="mt-6"
          >
            <Link
              to={`/game/${activeGame.id}`}
              className="group relative inline-flex items-center gap-3 px-8 py-3 bg-jinx-pink text-white font-bold tracking-widest overflow-hidden transform skew-x-12 border-2 border-transparent hover:border-white transition-all shadow-md"
            >
              <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,#000,#000_8px,transparent_5px,transparent_15px)]"></div>
              <span className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-10 transition-opacity"></span>
              <span className="relative flex items-center gap-2 -skew-x-12 z-10">
                VER DETALLES <Gamepad2 size={20} />
              </span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* CONTROLES */}
      <div className="absolute inset-x-0 bottom-8 z-30 flex flex-col items-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex gap-20">
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

        <div className="flex gap-3">
          {games.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-1.5 rounded-full transition-colors duration-300 ${idx === activeIndex ? "w-10 bg-zaun-green" : "w-3 bg-gray-700 hover:bg-gray-500"}`}
              aria-label={`Ir a slide ${idx}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;

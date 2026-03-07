import React, { useState, useEffect, useRef, useCallback } from "react";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useGames } from "../../hooks/useGamesData";
import GameCard from "../common/GameCard";

// ASSETS IMPORTS
import BrushPink from "../../assets/images/brush_royal_pink.webp";
import XGreen from "../../assets/images/XX_green_face.webp";
import PinkPaint from "../../assets/images/pink_paint.webp";

// --- FONDO MURAL (CAOS URBANO) ---
// 🚀 OPTIMIZACIÓN 1: React.memo() evita que este componente pesado
// se vuelva a renderizar cuando cambiamos de página. ¡Ahorro puro de CPU!
const BackgroundMural = React.memo(() => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none bg-gray-950">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black opacity-90" />
    <img
      src={PinkPaint}
      alt=""
      loading="lazy"
      decoding="async"
      className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] object-cover opacity-[0.03] rotate-180"
    />
    <img
      src={BrushPink}
      alt=""
      loading="lazy"
      decoding="async"
      className="absolute top-[15%] right-[20%] w-96 opacity-[0.04] rotate-12"
    />
    <img
      src={XGreen}
      alt=""
      loading="lazy"
      decoding="async"
      className="absolute bottom-20 left-12 w-32 opacity-[0.05] -rotate-12"
    />
  </div>
));

// Necesario para que React DevTools lo muestre con nombre
BackgroundMural.displayName = "BackgroundMural";

// --- COMPONENTE PRINCIPAL ---
const GameList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [gamesPerPage, setGamesPerPage] = useState(9);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setGamesPerPage(5);
      } else {
        setGamesPerPage(9);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { data, isLoading, isError, isPlaceholderData } = useGames(
    currentPage,
    gamesPerPage,
  );

  const games = data?.results || [];
  const totalPages = Math.min(
    Math.ceil((data?.count || 0) / gamesPerPage),
    100,
  );

  const listRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    setCurrentPage(1);
  }, [gamesPerPage]);

  // 🚀 LÓGICA DE SCROLL EXACTA
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (listRef.current) {
      window.scrollTo({
        top: listRef.current.offsetTop + 220,
        behavior: "smooth",
      });
    }
  }, [currentPage]);

  // 🚀 OPTIMIZACIÓN 2: useCallback congela estas funciones en memoria
  // para que React no las destruya y re-cree en cada render.
  const handleNext = useCallback(() => {
    if (!isPlaceholderData && currentPage < totalPages) {
      setCurrentPage((o) => o + 1);
    }
  }, [isPlaceholderData, currentPage, totalPages]);

  const handlePrev = useCallback(() => {
    if (!isPlaceholderData && currentPage > 1) {
      setCurrentPage((o) => Math.max(o - 1, 1));
    }
  }, [isPlaceholderData, currentPage]);

  return (
    <section
      ref={listRef}
      className="relative w-full py-12 md:py-24 px-4 md:px-8 bg-gray-950 min-h-screen border-t border-gray-900 overflow-hidden"
    >
      <BackgroundMural />

      {/* CABECERA */}
      <div className="max-w-7xl mx-auto mb-10 md:mb-20 relative flex flex-col items-center z-10">
        <div className="relative">
          <img
            src={BrushPink}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute -inset-4 w-[120%] h-[140%] object-contain opacity-90 -rotate-2 z-0"
          />
          <h2 className="relative z-10 font-marker text-4xl sm:text-5xl md:text-7xl text-center text-white drop-shadow-[4px_4px_0_#000]">
            LISTA DE <br className="sm:hidden" />
            <span className="text-zaun-green text-stroke-black">JUEGOS</span>
          </h2>
        </div>
      </div>

      {/* GRID DE JUEGOS */}
      {/* 🚀 min-h-[800px] es la clase estándar para asegurar la altura en Tailwind v4/v3 */}
      <div className="max-w-7xl mx-auto z-10 relative min-h-200">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(gamesPerPage)].map((_, i) => (
              <div
                key={i}
                className="h-100 md:h-125 bg-gray-900 rounded-lg animate-pulse border border-gray-800"
              ></div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center p-8 md:p-12 bg-gray-900 border-2 border-red-500 rounded-lg shadow-[8px_8px_0_#000] mx-4 md:mx-0">
            <span className="text-red-500 font-marker text-2xl md:text-3xl mb-2 text-center">
              ERROR DE CONEXIÓN
            </span>
            <p className="text-gray-400 font-mono text-center text-sm md:text-base">
              Fallo al contactar al servidor. Intenta recargar la página.
            </p>
          </div>
        ) : (
          <div
            className={clsx(
              "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 transition-[opacity,filter] duration-300",
              // 🚀 OPTIMIZACIÓN 3: grayscale-[50%] es la clase sintácticamente correcta
              isPlaceholderData
                ? "opacity-40 pointer-events-none grayscale-50"
                : "opacity-100 grayscale-0",
            )}
          >
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </div>

      {/* PAGINACIÓN */}
      {!isLoading && !isError && (
        <div className="max-w-7xl mx-auto mt-12 md:mt-24 flex flex-wrap justify-center items-center gap-3 sm:gap-6 md:gap-8 z-10 relative px-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1 || isPlaceholderData}
            className="p-3 md:p-4 rounded-full bg-gray-900 border-2 border-gray-700 text-white hover:border-jinx-pink hover:text-jinx-pink disabled:opacity-30 disabled:cursor-not-allowed transition-[color,border-color,transform,box-shadow] duration-200 shadow-[4px_4px_0_#000] active:translate-y-0.5 active:shadow-none will-change-[transform,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jinx-pink shrink-0"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          <div className="px-4 py-2 md:px-6 md:py-2 bg-gray-900 rounded-full border-2 border-gray-800 shadow-[4px_4px_0_#000] shrink-0">
            <span className="font-mono text-gray-400 text-sm md:text-lg whitespace-nowrap">
              PÁGINA{" "}
              <span className="text-white font-bold text-lg md:text-2xl mx-1 md:mx-2">
                {currentPage}
              </span>{" "}
              / {totalPages}
            </span>
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages || isPlaceholderData}
            className="p-3 md:p-4 rounded-full bg-gray-900 border-2 border-gray-700 text-white hover:border-zaun-green hover:text-zaun-green disabled:opacity-30 disabled:cursor-not-allowed transition-[color,border-color,transform,box-shadow] duration-200 shadow-[4px_4px_0_#000] active:translate-y-0.5 active:shadow-none will-change-[transform,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zaun-green shrink-0"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        </div>
      )}
    </section>
  );
};

export default GameList;

import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

// 🚀 IMPORTACIÓN CORREGIDA: Ahora apunta a nuestro archivo unificado
import { useGames } from "../../hooks/useGamesData";
import GameCard from "../common/GameCard";

// ASSETS IMPORTS
import BrushPink from "../../assets/images/brush_royal_pink.webp";
import XGreen from "../../assets/images/XX_green_face.webp";
import PinkPaint from "../../assets/images/pink_paint.webp";

// --- FONDO MURAL (CAOS URBANO) ---
const BackgroundMural = () => (
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
);

// --- COMPONENTE PRINCIPAL ---
const GameList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 9;

  // 🚀 LA MAGIA DEL CUSTOM HOOK
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
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // Scroll automático hacia la cabecera de la lista al cambiar de página
    if (!isPlaceholderData && listRef.current) {
      listRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentPage, isPlaceholderData]);

  const handleNext = () => {
    if (!isPlaceholderData && currentPage < totalPages)
      setCurrentPage((o) => o + 1);
  };
  const handlePrev = () => {
    setCurrentPage((o) => Math.max(o - 1, 1));
  };

  return (
    <section
      ref={listRef}
      className="relative w-full py-24 px-4 md:px-8 bg-gray-950 min-h-screen border-t border-gray-900 overflow-hidden"
    >
      <BackgroundMural />

      {/* CABECERA (LISTA DE JUEGOS) */}
      <div className="max-w-7xl mx-auto mb-20 relative flex flex-col items-center z-10">
        <div className="relative">
          <img
            src={BrushPink}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute -inset-4 w-[120%] h-[140%] object-contain opacity-90 -rotate-2 z-0"
          />
          <h2 className="relative z-10 font-marker text-5xl md:text-7xl text-white drop-shadow-[4px_4px_0_#000]">
            LISTA DE{" "}
            <span className="text-zaun-green text-stroke-black">JUEGOS</span>
          </h2>
        </div>
      </div>

      {/* GRID DE JUEGOS */}
      <div className="max-w-7xl mx-auto z-10 relative">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="h-130 bg-gray-900 rounded-lg animate-pulse border border-gray-800"
              ></div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center p-12 bg-gray-900 border-2 border-red-500 rounded-lg shadow-[8px_8px_0_#000]">
            <span className="text-red-500 font-marker text-3xl mb-2">
              ERROR DE CONEXIÓN
            </span>
            {/* 🚀 MENSAJE CORREGIDO */}
            <p className="text-gray-400 font-mono text-center">
              Fallo al contactar al servidor. Intenta recargar la página.
            </p>
          </div>
        ) : (
          <div
            className={clsx(
              "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-200",
              isPlaceholderData ? "opacity-50" : "opacity-100",
            )}
          >
            {/* 🚀 USO DE LA GAME CARD GLOBAL */}
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </div>

      {/* PAGINACIÓN */}
      {!isLoading && !isError && (
        <div className="max-w-7xl mx-auto mt-24 flex justify-center items-center gap-6 md:gap-8 z-10 relative">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="p-4 rounded-full bg-gray-900 border-2 border-gray-700 text-white hover:border-jinx-pink hover:text-jinx-pink disabled:opacity-30 disabled:cursor-not-allowed transition-[color,border-color,transform,box-shadow] duration-200 shadow-[4px_4px_0_#000] active:translate-y-0.5 active:shadow-none will-change-[transform,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jinx-pink"
          >
            <ChevronLeft size={32} />
          </button>
          <div className="px-6 py-2 bg-gray-900 rounded-full border-2 border-gray-800 shadow-[4px_4px_0_#000]">
            <span className="font-mono text-gray-400 text-lg">
              PÁGINA{" "}
              <span className="text-white font-bold text-2xl mx-2">
                {currentPage}
              </span>{" "}
              / {totalPages}
            </span>
          </div>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages || isPlaceholderData}
            className="p-4 rounded-full bg-gray-900 border-2 border-gray-700 text-white hover:border-zaun-green hover:text-zaun-green disabled:opacity-30 disabled:cursor-not-allowed transition-[color,border-color,transform,box-shadow] duration-200 shadow-[4px_4px_0_#000] active:translate-y-0.5 active:shadow-none will-change-[transform,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zaun-green"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </section>
  );
};

export default GameList;

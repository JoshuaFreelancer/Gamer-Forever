import { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Cpu, Search, X } from "lucide-react";

// 🚀 TUS HELPERS CENTRALIZADOS Y HOOKS
import { useInfiniteCollection } from "../hooks/useInfiniteCollection";
import { getGiantPlatformIcon } from "../utils/giantPlatformIcons";

// ASSETS IMPORTS
import BrushPink from "../assets/images/brush_royal_pink.webp";
import PinkPaint from "../assets/images/pink_paint.webp";
import XGreen from "../assets/images/X_green.webp";

// --- FONDO MURAL ---
const PlatformsBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-gray-950 transform-gpu">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black opacity-90" />
    <img
      src={PinkPaint}
      alt=""
      width="800"
      height="800"
      loading="lazy"
      decoding="async"
      className="absolute top-10 left-[10%] w-[40%] h-[40%] object-cover opacity-[0.03] rotate-12"
    />
    <img
      src={BrushPink}
      alt=""
      width="800"
      height="300"
      loading="lazy"
      decoding="async"
      className="absolute bottom-10 right-[-5%] w-[50%] opacity-[0.04] -rotate-12"
    />
    <img
      src={XGreen}
      alt=""
      width="192"
      height="192"
      loading="lazy"
      decoding="async"
      className="absolute top-[30%] right-[15%] w-48 opacity-[0.03] rotate-45"
    />
    <img
      src={XGreen}
      alt=""
      width="128"
      height="128"
      loading="lazy"
      decoding="async"
      className="absolute bottom-[20%] left-[5%] w-32 opacity-[0.02] -rotate-12"
    />
  </div>
);

// --- COMPONENTE: TARJETA DE PLATAFORMA ---
const PlatformCard = ({ platform }) => {
  return (
    <Link
      to={`/search?platforms=${platform.id}`}
      className="group relative h-48 sm:h-56 md:h-72 w-full block overflow-hidden border-2 border-gray-800 bg-gray-950 rounded-xl md:hover:border-zaun-green transition-all duration-300 transform md:hover:-translate-y-2 shadow-[2px_2px_0_#000] md:shadow-none md:hover:shadow-[8px_8px_0_#0aff60] active:scale-95 md:active:scale-100 will-change-[transform,border-color]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-gray-800/30 via-gray-950 to-black opacity-100 md:opacity-80 md:group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="absolute inset-0 opacity-20 md:opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[16px_16px] md:group-hover:opacity-20 transition-opacity pointer-events-none" />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 transform md:group-hover:-translate-y-4 transition-transform duration-500 pb-12 md:pb-8 [&>svg]:w-20 [&>svg]:h-20 sm:[&>svg]:w-28 sm:[&>svg]:h-28 md:[&>svg]:w-40 md:[&>svg]:h-40 [&>svg]:object-contain">
        {getGiantPlatformIcon(platform.slug)}
      </div>

      <div className="absolute bottom-0 w-full bg-linear-to-t from-black via-gray-950/90 to-transparent pt-8 md:pt-12 pb-3 md:pb-5 px-4 md:px-6 transition-transform duration-300 z-10">
        <div className="absolute left-0 bottom-3 md:bottom-5 w-1 h-6 md:h-8 bg-gray-800 md:group-hover:bg-jinx-pink transition-colors duration-300" />

        <h3
          className="font-marker text-base sm:text-xl md:text-2xl text-white md:group-hover:text-jinx-pink transition-colors duration-300 drop-shadow-[2px_2px_0_#000] md:drop-shadow-[4px_4px_0_#000] leading-tight wrap-break-word"
          lang="en"
        >
          {platform.name.toUpperCase()}
        </h3>

        <div className="w-full h-1 bg-gray-800 mt-1 md:mt-2 rounded-full overflow-hidden pointer-events-none">
          <div className="h-full bg-zaun-green w-full md:w-0 md:group-hover:w-full transition-[width] duration-500 ease-out will-change-[width]" />
        </div>

        <div className="flex items-center justify-between mt-1 md:mt-2 pointer-events-none">
          <p className="text-gray-300 md:text-gray-400 text-[10px] md:text-xs font-mono font-bold whitespace-nowrap">
            {platform.games_count.toLocaleString()} JUEGOS
          </p>
          <ArrowRight className="w-4 h-4 md:w-4 md:h-4 text-white md:text-gray-600 md:group-hover:text-white transform translate-x-0 md:-translate-x-4 md:group-hover:translate-x-0 transition-all duration-300" />
        </div>
      </div>
    </Link>
  );
};

// --- COMPONENTE PRINCIPAL ---
const Platforms = () => {
  const loadMoreRef = useRef(null);

  // 🚀 ESTADO PARA BUSCADOR CLIENT-SIDE
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteCollection("platforms", "allPlatformsInfinite", 14);

  // 🚀 MOTOR DE FILTRADO ESTRICTO (INICIO DE PALABRA)
  const filteredPlatforms = useMemo(() => {
    if (!data) return [];

    const allPlatforms = data.pages.flatMap((page) => page.results);

    if (!searchTerm.trim()) return allPlatforms;

    const lowerSearch = searchTerm.toLowerCase().trim();

    return allPlatforms.filter((platform) => {
      const name = platform.name.toLowerCase();
      // 🚀 Comprobamos si ALGUNA palabra en el nombre de la plataforma EMPIEZA con la búsqueda
      return name.split(" ").some((word) => word.startsWith(lowerSearch));
    });
  }, [data, searchTerm]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          !searchTerm
        ) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, searchTerm]);

  return (
    <section className="relative w-full min-h-screen pt-4 md:pt-18 pb-20 px-4 md:px-8 text-white overflow-hidden">
      <PlatformsBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-8 md:mb-16 flex flex-col items-center text-center">
          <div className="inline-block mb-4 px-2 md:px-3 py-1 bg-jinx-pink border-2 border-black shadow-[4px_4px_0_#000] -rotate-2">
            <span className="font-bold text-white tracking-widest text-[10px] md:text-sm flex items-center gap-1 md:gap-2 uppercase">
              <Cpu className="text-white w-4 h-4 md:w-4 md:h-4" /> ELIGE TU
              CAMPO DE BATALLA
            </span>
          </div>

          <div className="relative inline-block w-full px-4 md:px-0 justify-center items-center">
            <img
              src={BrushPink}
              alt=""
              width="400"
              height="150"
              loading="lazy"
              decoding="async"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] md:w-full h-[140%] md:h-[120%] object-contain opacity-40 rotate-2 pointer-events-none"
            />
            <h1 className="font-marker text-4xl sm:text-5xl md:text-8xl relative z-10 text-white drop-shadow-[4px_4px_0_#000] md:drop-shadow-[6px_6px_0_#000] leading-none">
              DIRECTORIO DE <br />
              <span className="text-zaun-green text-stroke-black">
                HARDWARE
              </span>
            </h1>
          </div>

          <p className="mt-4 md:mt-6 text-gray-400 font-roboto text-sm sm:text-base md:text-xl max-w-2xl mx-auto text-balance mb-8">
            Desde la PC Master Race hasta las consolas retro. Selecciona el
            equipo y explora todo el catálogo compatible.
          </p>

          {/* 🚀 BUSCADOR RÁPIDO CLIENT-SIDE */}
          <div className="w-[95%] sm:w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto relative group mt-4 mb-4">
            <div className="absolute inset-0 bg-jinx-pink transform translate-x-1.5 translate-y-1.5 md:translate-x-2 md:translate-y-2 border-2 border-black -z-10 group-focus-within:translate-x-0 group-focus-within:translate-y-0 transition-transform duration-200"></div>

            <div className="relative flex items-center bg-gray-900 border-2 border-gray-600 group-focus-within:border-white transition-colors duration-200">
              <span className="pl-3 md:pl-4 text-white group-focus-within:text-jinx-pink transition-colors duration-300 shrink-0">
                <Search className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
              </span>
              <input
                type="text"
                placeholder="BUSCAR HARDWARE..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-white font-mono font-bold text-sm md:text-base py-3 md:py-4 px-3 outline-none focus:ring-0 placeholder-gray-400 uppercase tracking-wider"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="pr-3 md:pr-4 pl-2 py-2 text-gray-400 hover:text-white transition-colors flex items-center justify-center shrink-0"
                  title="Borrar búsqueda"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
                </button>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
            {[...Array(14)].map((_, i) => (
              <div
                key={i}
                className="h-48 sm:h-56 md:h-72 bg-gray-900 rounded-xl animate-pulse border-2 border-gray-800"
              ></div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-6 md:p-8 border-4 border-red-600 bg-gray-900 shadow-[8px_8px_0_#dc2626] text-center max-w-lg mx-auto">
            <span className="text-red-500 font-marker text-2xl md:text-3xl mb-2 block">
              ERROR DE SISTEMA
            </span>
            <p className="text-gray-300 font-mono text-sm md:text-base">
              No pudimos cargar las plataformas. Revisa tu conexión.
            </p>
          </div>
        ) : (
          <>
            {filteredPlatforms.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-gray-800 bg-gray-900/50">
                <span className="font-marker text-xl md:text-2xl text-gray-500 block mb-2">
                  ZONA VACÍA
                </span>
                <p className="font-mono text-gray-400 text-sm md:text-base">
                  No se encontró ningún hardware llamado{" "}
                  <span className="text-jinx-pink">{searchTerm}</span>
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6 animate-in fade-in duration-300">
                {filteredPlatforms.map((platform) => (
                  <PlatformCard key={platform.id} platform={platform} />
                ))}
              </div>
            )}

            {!searchTerm && (
              <div
                ref={loadMoreRef}
                className="w-full h-16 mt-8 flex items-center justify-center"
              >
                {isFetchingNextPage && (
                  <span className="font-marker text-lg md:text-2xl tracking-widest text-jinx-pink animate-pulse">
                    CONECTANDO HARDWARE...
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Platforms;

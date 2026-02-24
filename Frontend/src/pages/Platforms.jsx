import { useEffect, useRef, Fragment } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Cpu } from "lucide-react";

// 🚀 TUS HELPERS CENTRALIZADOS Y HOOKS
import { useInfiniteCollection } from "../hooks/useInfiniteCollection";
import { getGiantPlatformIcon } from "../utils/giantPlatformIcons";

// ASSETS IMPORTS (Asegúrate que la ruta sea correcta)
import BrushPink from "../assets/images/brush_royal_pink.webp";
import PinkPaint from "../assets/images/pink_paint.webp";
import XGreen from "../assets/images/X_green.webp";

// --- FONDO MURAL ---
const PlatformsBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-gray-950 transform-gpu">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black opacity-90" />
    {/* 🚀 OPTIMIZACIÓN: Dimensiones explícitas para evitar CLS en la carga del fondo */}
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
      className="group relative h-72 w-full block overflow-hidden border-2 border-gray-800 bg-gray-950 rounded-xl hover:border-zaun-green transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[8px_8px_0_#0aff60] will-change-[transform,border-color]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-gray-800/30 via-gray-950 to-black opacity-80 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[16px_16px] group-hover:opacity-20 transition-opacity pointer-events-none" />

      {/* 🚀 Los iconos SVG cargan instantáneamente, no requieren srcSet ni lazy loading */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 transform group-hover:-translate-y-4 transition-transform duration-500 pb-12">
        {getGiantPlatformIcon(platform.slug)}
      </div>

      <div className="absolute bottom-0 w-full bg-linear-to-t from-black via-gray-950/90 to-transparent pt-12 pb-5 px-6 transition-transform duration-300 z-10">
        <div className="absolute left-0 bottom-5 w-1 h-8 bg-gray-800 group-hover:bg-jinx-pink transition-colors duration-300" />

        <h3
          className="font-marker text-xl md:text-2xl text-white group-hover:text-jinx-pink transition-colors duration-300 drop-shadow-[4px_4px_0_#000] leading-tight wrap-break-word hyphens-auto"
          lang="en"
        >
          {platform.name.toUpperCase()}
        </h3>

        <div className="w-full h-1 bg-gray-800 mt-2 rounded-full overflow-hidden pointer-events-none">
          <div className="h-full bg-zaun-green w-0 group-hover:w-full transition-[width] duration-500 ease-out will-change-[width]" />
        </div>

        <div className="flex items-center justify-between mt-2 pointer-events-none">
          <p className="text-gray-400 text-xs font-mono font-bold">
            {platform.games_count.toLocaleString()} JUEGOS
          </p>
          <ArrowRight
            size={16}
            className="text-gray-600 group-hover:text-white transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300"
          />
        </div>
      </div>
    </Link>
  );
};

// --- COMPONENTE PRINCIPAL ---
const Platforms = () => {
  const loadMoreRef = useRef(null);

  // 🚀 HOOK INFINITO
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteCollection("platforms", "allPlatformsInfinite", 14);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
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
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <section className="relative w-full min-h-screen pt-18 pb-20 px-4 md:px-8 text-white overflow-hidden">
      <PlatformsBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16 md:mb-24 flex flex-col items-center text-center">
          <div className="inline-block mb-4 px-3 py-1 bg-jinx-pink border-2 border-black shadow-[4px_4px_0_#000] -rotate-2">
            <span className="font-bold text-white tracking-widest text-sm flex items-center gap-2 uppercase">
              <Cpu size={16} className="text-white" /> ELIGE TU CAMPO DE BATALLA
            </span>
          </div>

          <div className="relative">
            {/* 🚀 OPTIMIZACIÓN: Añadidas proporciones al elemento decorativo del título */}
            <img
              src={BrushPink}
              alt=""
              width="400"
              height="150"
              loading="lazy"
              decoding="async"
              className="absolute -top-12 -left-12 w-[140%] h-[160%] object-contain opacity-40 rotate-2 pointer-events-none"
            />
            <h1 className="font-marker text-5xl md:text-8xl relative z-10 text-white drop-shadow-[6px_6px_0_#000] leading-none">
              DIRECTORIO DE <br />
              <span className="text-zaun-green text-stroke-black">
                HARDWARE
              </span>
            </h1>
          </div>
          <p className="mt-6 text-gray-400 font-roboto text-lg md:text-xl max-w-2xl mx-auto">
            Desde la PC Master Race hasta las consolas retro. Selecciona el
            equipo y explora todo el catálogo compatible.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-72 bg-gray-900 rounded-xl animate-pulse border-2 border-gray-800"
              ></div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 border-4 border-red-600 bg-gray-900 shadow-[8px_8px_0_#dc2626] text-center max-w-lg mx-auto">
            <span className="text-red-500 font-marker text-3xl mb-2 block">
              ERROR DE SISTEMA
            </span>
            <p className="text-gray-300 font-mono">
              No pudimos cargar las plataformas. Revisa tu conexión.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.pages.map((page, index) => (
                <Fragment key={index}>
                  {page.results.map((platform) => (
                    <PlatformCard key={platform.id} platform={platform} />
                  ))}
                </Fragment>
              ))}
            </div>

            <div
              ref={loadMoreRef}
              className="w-full h-16 mt-8 flex items-center justify-center"
            >
              {isFetchingNextPage && (
                <span className="font-marker text-xl md:text-2xl tracking-widest text-jinx-pink animate-pulse">
                  CONECTANDO HARDWARE...
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Platforms;

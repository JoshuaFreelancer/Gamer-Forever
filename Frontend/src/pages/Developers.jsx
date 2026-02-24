import { useEffect, useRef, Fragment } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Code, Sparkles } from "lucide-react";

// 🚀 TUS HELPERS CENTRALIZADOS Y HOOKS
import { getCroppedImageUrl } from "../utils/imageCrop";
import { useInfiniteCollection } from "../hooks/useInfiniteCollection";

// ASSETS IMPORTS (Rutas estandarizadas)
import BrushPink from "../assets/images/brush_royal_pink.webp";
import GreenFace from "../assets/images/XX_green_face.webp";
import PinkPaint from "../assets/images/pink_paint.webp";
import XGreen from "../assets/images/X_green.webp";

// --- FONDO MURAL ---
const DevelopersBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-gray-950 transform-gpu">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black opacity-90" />
    {/* 🚀 OPTIMIZACIÓN: Dimensiones explícitas para evitar CLS en el mural */}
    <img
      src={PinkPaint}
      alt=""
      width="800"
      height="800"
      loading="lazy"
      decoding="async"
      className="absolute top-20 right-[5%] w-[40%] h-[40%] object-cover opacity-[0.03] -rotate-12"
    />
    <img
      src={GreenFace}
      alt=""
      width="600"
      height="600"
      loading="lazy"
      decoding="async"
      className="absolute bottom-10 left-[-5%] w-[30%] opacity-[0.04] rotate-12"
    />
    <img
      src={XGreen}
      alt=""
      width="128"
      height="128"
      loading="lazy"
      decoding="async"
      className="absolute top-[20%] left-[15%] w-32 opacity-[0.03] rotate-45"
    />
  </div>
);

// --- COMPONENTE: TARJETA DE DESARROLLADOR ---
const DeveloperCard = ({ developer }) => {
  return (
    <Link
      to={`/search?developers=${developer.id}`}
      className="group relative h-72 w-full block overflow-hidden border-2 border-gray-800 bg-gray-950 rounded-xl hover:border-zaun-green transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[8px_8px_0_#0aff60] will-change-[transform,border-color]"
    >
      <div className="absolute inset-0 bg-black">
        {/* 🚀 OPTIMIZACIÓN: 600x400 para la imagen principal */}
        <img
          src={getCroppedImageUrl(developer.image_background)}
          alt={developer.name}
          width="600"
          height="400"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-90 group-hover:scale-110 transition-[transform,filter,opacity] duration-500 will-change-[transform,filter]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-gray-950 via-gray-950/60 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-300 pointer-events-none will-change-opacity" />
      </div>

      {/* 🚀 OPTIMIZACIÓN: Dimensiones para el adorno (40x40) */}
      <img
        src={XGreen}
        alt=""
        width="40"
        height="40"
        loading="lazy"
        decoding="async"
        className="absolute top-3 right-3 w-10 opacity-0 group-hover:opacity-80 rotate-12 transition-opacity duration-300 pointer-events-none z-10"
      />

      <div className="absolute bottom-0 w-full z-10 overflow-hidden rounded-b-xl border-t border-white/10 group-hover:border-zaun-green/50 transition-colors duration-300">
        <div className="absolute inset-0 bg-gray-950/80">
          {/* 🚀 OPTIMIZACIÓN: Dimensiones para la textura (600x400) */}
          <img
            src={PinkPaint}
            alt=""
            width="600"
            height="400"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale mix-blend-overlay pointer-events-none"
          />
        </div>

        <div className="relative p-5 bg-linear-to-t from-black/50 to-transparent">
          <div className="absolute left-0 bottom-5 w-1.5 h-8 bg-gray-700 group-hover:bg-jinx-pink transition-colors duration-300" />

          <div className="flex items-center gap-2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Sparkles size={12} className="text-zaun-green" />
            <span className="text-zaun-green text-[10px] font-bold tracking-widest uppercase">
              ESTUDIO / DEV
            </span>
          </div>

          <h3
            className="font-marker text-xl md:text-2xl text-white group-hover:text-jinx-pink transition-colors duration-300 drop-shadow-[2px_2px_0_#000] leading-tight wrap-break-word hyphens-auto"
            lang="en"
          >
            {developer.name.toUpperCase()}
          </h3>

          <div className="w-full h-1 bg-gray-800 mt-3 rounded-full overflow-hidden pointer-events-none">
            <div className="h-full bg-zaun-green w-0 group-hover:w-full transition-[width] duration-500 ease-out will-change-[width]" />
          </div>

          <div className="flex items-center justify-between mt-3 pointer-events-none">
            <p className="text-gray-400 text-xs font-mono font-bold">
              {developer.games_count.toLocaleString()} PROYECTOS
            </p>
            <ArrowRight
              size={16}
              className="text-gray-500 group-hover:text-white transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

// --- COMPONENTE PRINCIPAL ---
const Developers = () => {
  const loadMoreRef = useRef(null);

  // 🚀 LA MAGIA DEL HOOK INFINITO CENTRALIZADO
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteCollection("developers", "allDevelopersInfinite", 24);

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
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <section className="relative w-full min-h-screen pt-18 pb-20 px-4 md:px-8 text-white overflow-hidden">
      <DevelopersBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16 md:mb-24 flex flex-col items-center text-center">
          <div className="inline-block mb-4 px-3 py-1 bg-jinx-pink border-2 border-black shadow-[4px_4px_0_#000] -rotate-2">
            <span className="font-bold text-white tracking-widest text-sm flex items-center gap-2 uppercase">
              <Code size={16} className="text-white" /> Las mentes maestras
            </span>
          </div>

          <div className="relative">
            {/* 🚀 OPTIMIZACIÓN: Dimensiones para el decorativo del título */}
            <img
              src={BrushPink}
              alt=""
              width="400"
              height="150"
              loading="lazy"
              decoding="async"
              className="absolute -top-13 -left-12 w-[140%] h-[160%] object-contain opacity-40 rotate-2 pointer-events-none"
            />
            <h1 className="font-marker text-5xl md:text-8xl relative z-10 text-white drop-shadow-[6px_6px_0_#000] leading-none">
              FORJADORES DE <br />
              <span className="text-zaun-green text-stroke-black">JUEGOS</span>
            </h1>
          </div>
          <p className="mt-6 text-gray-400 font-roboto text-lg md:text-xl max-w-2xl mx-auto">
            Descubre a los arquitectos detrás del caos. Busca tus juegos
            favoritos filtrando por el estudio que los creó.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="h-72 bg-gray-900 rounded-xl animate-pulse border-2 border-gray-800"
              ></div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 border-4 border-red-600 bg-gray-900 shadow-[8px_8px_0_#dc2626] text-center max-w-lg mx-auto">
            <span className="text-red-500 font-marker text-3xl mb-2 block">
              ERROR DE CONEXIÓN
            </span>
            <p className="text-gray-300 font-mono">
              Fallo al contactar a los servidores.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.pages.map((page, index) => (
                <Fragment key={index}>
                  {page.results.map((developer) => (
                    <DeveloperCard key={developer.id} developer={developer} />
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
                  RASTREANDO MÁS ESTUDIOS...
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Developers;

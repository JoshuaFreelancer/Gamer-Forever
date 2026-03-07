import { useEffect, useRef, Fragment, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Code, Sparkles, Search, X } from "lucide-react";

// 🚀 TUS HELPERS CENTRALIZADOS Y HOOKS
import { getCroppedImageUrl } from "../utils/imageCrop";
import { useInfiniteCollection } from "../hooks/useInfiniteCollection";
import useDebounce from "../utils/debounce";

// ASSETS IMPORTS
import BrushPink from "../assets/images/brush_royal_pink.webp";
import GreenFace from "../assets/images/XX_green_face.webp";
import PinkPaint from "../assets/images/pink_paint.webp";
import XGreen from "../assets/images/X_green.webp";

// --- FONDO MURAL ---
const DevelopersBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-gray-950 transform-gpu">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black opacity-90" />
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
// (Mantenido exactamente igual, es perfecto)
const DeveloperCard = ({ developer }) => {
  return (
    <Link
      to={`/search?developers=${developer.id}`}
      className="group relative h-48 sm:h-56 md:h-72 w-full block overflow-hidden border-2 border-gray-800 bg-gray-950 rounded-xl md:hover:border-zaun-green transition-all duration-300 transform md:hover:-translate-y-2 shadow-[2px_2px_0_#000] md:shadow-none md:hover:shadow-[8px_8px_0_#0aff60] active:scale-95 md:active:scale-100 will-change-[transform,border-color]"
    >
      <div className="absolute inset-0 bg-black">
        <img
          src={getCroppedImageUrl(developer.image_background)}
          alt={developer.name}
          width="600"
          height="400"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover grayscale-0 opacity-80 md:opacity-50 md:grayscale md:group-hover:grayscale-0 md:group-hover:opacity-90 md:group-hover:scale-110 transition-[transform,filter,opacity] duration-500 will-change-[transform,filter]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-gray-950 via-gray-950/80 md:via-gray-950/60 to-transparent opacity-100 md:opacity-90 md:group-hover:opacity-70 transition-opacity duration-300 pointer-events-none will-change-opacity" />
      </div>

      <img
        src={XGreen}
        alt=""
        width="40"
        height="40"
        loading="lazy"
        decoding="async"
        className="hidden md:block absolute top-3 right-3 w-10 opacity-0 group-hover:opacity-80 rotate-12 transition-opacity duration-300 pointer-events-none z-10"
      />

      <div className="absolute bottom-0 w-full z-10 overflow-hidden rounded-b-xl border-t border-white/10 md:group-hover:border-zaun-green/50 transition-colors duration-300">
        <div className="absolute inset-0 bg-gray-950/90 md:bg-gray-950/80">
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

        <div className="relative p-3 md:p-5 bg-linear-to-t from-black/50 to-transparent">
          <div className="absolute left-0 bottom-3 md:bottom-5 w-1 md:w-1.5 h-6 md:h-8 bg-gray-700 md:group-hover:bg-jinx-pink transition-colors duration-300" />

          <div className="hidden md:flex items-center gap-2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Sparkles size={12} className="text-zaun-green" />
            <span className="text-zaun-green text-[10px] font-bold tracking-widest uppercase">
              ESTUDIO / DEV
            </span>
          </div>

          <h3
            className="font-marker text-lg sm:text-xl md:text-2xl text-white md:group-hover:text-jinx-pink transition-colors duration-300 drop-shadow-[2px_2px_0_#000] md:drop-shadow-[2px_2px_0_#000] leading-tight wrap-break-word"
            lang="en"
          >
            {developer.name.toUpperCase()}
          </h3>

          <div className="w-full h-1 bg-gray-800 mt-2 md:mt-3 rounded-full overflow-hidden pointer-events-none">
            <div className="h-full bg-zaun-green w-full md:w-0 md:group-hover:w-full transition-[width] duration-500 ease-out will-change-[width]" />
          </div>

          <div className="flex items-center justify-between mt-2 md:mt-3 pointer-events-none">
            <p className="text-gray-300 md:text-gray-400 text-[10px] sm:text-xs font-mono font-bold whitespace-nowrap">
              {developer.games_count.toLocaleString()} PROYECTOS
            </p>
            <ArrowRight className="w-4 h-4 md:w-4 md:h-4 text-white md:text-gray-500 md:group-hover:text-white transform translate-x-0 md:-translate-x-2 md:group-hover:translate-x-0 transition-all duration-300" />
          </div>
        </div>
      </div>
    </Link>
  );
};

// --- COMPONENTE PRINCIPAL ---
const Developers = () => {
  const loadMoreRef = useRef(null);

  // 🚀 LÓGICA DE BÚSQUEDA SERVER-SIDE
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [localSearchTerm, setLocalSearchTerm] = useState(initialSearch);

  // 🚀 DEBOUNCE: Esperamos 500ms antes de cambiar la URL para no saturar la API mientras el usuario escribe
  const debouncedSearchTerm = useDebounce(localSearchTerm, 500);

  // Sincronizamos la URL cuando el usuario termina de escribir
  useEffect(() => {
    if (debouncedSearchTerm) {
      setSearchParams({ search: debouncedSearchTerm });
    } else {
      setSearchParams({});
    }
  }, [debouncedSearchTerm, setSearchParams]);

  // 🚀 Modificamos el hook para que le pase la búsqueda a React Query
  // Importante: tu useInfiniteCollection debe aceptar este cuarto parámetro.
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteCollection(
    "developers",
    `allDevelopersInfinite-${debouncedSearchTerm}`, // Clave única de caché
    24,
    debouncedSearchTerm, // Pasamos el parámetro de búsqueda a la API
  );

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

  // Manejo manual de borrar
  const handleClear = () => {
    setLocalSearchTerm("");
    setSearchParams({});
  };

  return (
    <section className="relative w-full min-h-screen pt-4 md:pt-18 pb-20 px-4 md:px-8 text-white overflow-hidden">
      <DevelopersBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* HEADER DE LA PÁGINA */}
        <div className="mb-8 md:mb-16 flex flex-col items-center text-center">
          <div className="inline-block mb-4 px-2 md:px-3 py-1 bg-jinx-pink border-2 border-black shadow-[4px_4px_0_#000] -rotate-2">
            <span className="font-bold text-white tracking-widest text-[10px] md:text-sm flex items-center gap-1 md:gap-2 uppercase">
              <Code className="text-white w-4 h-4 md:w-4 md:h-4" /> Las mentes
              maestras
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
              FORJADORES DE <br />
              <span className="text-zaun-green text-stroke-black">JUEGOS</span>
            </h1>
          </div>
          <p className="mt-4 md:mt-6 text-gray-400 font-roboto text-sm sm:text-base md:text-xl max-w-2xl mx-auto text-balance mb-8">
            Descubre a los arquitectos detrás del caos. Busca tus juegos
            favoritos filtrando por el estudio que los creó.
          </p>

          {/* 🚀 BUSCADOR RÁPIDO (SERVER-SIDE) 100% RESPONSIVE */}
          <div className="w-[95%] sm:w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto relative group mt-4 mb-4">
            <div className="absolute inset-0 bg-jinx-pink transform translate-x-1.5 translate-y-1.5 md:translate-x-2 md:translate-y-2 border-2 border-black -z-10 group-focus-within:translate-x-0 group-focus-within:translate-y-0 transition-transform duration-200"></div>

            <div className="relative flex items-center bg-gray-900 border-2 border-gray-600 group-focus-within:border-white transition-colors duration-200">
              <span className="pl-3 md:pl-4 text-white group-focus-within:text-jinx-pink transition-colors duration-300 shrink-0">
                <Search className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
              </span>
              <input
                type="text"
                placeholder="BUSCAR ESTUDIO..."
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                className="w-full bg-transparent text-white font-mono font-bold text-sm md:text-base py-3 md:py-4 px-3 outline-none focus:ring-0 placeholder-gray-400 uppercase tracking-wider"
              />
              {localSearchTerm && (
                <button
                  onClick={handleClear}
                  className="pr-3 md:pr-4 pl-2 py-2 text-gray-400 hover:text-white transition-colors flex items-center justify-center shrink-0"
                  title="Borrar búsqueda"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* GRID DE DESARROLLADORES */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="h-48 sm:h-56 md:h-72 bg-gray-900 rounded-xl animate-pulse border-2 border-gray-800"
              ></div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-6 md:p-8 border-4 border-red-600 bg-gray-900 shadow-[8px_8px_0_#dc2626] text-center max-w-lg mx-auto">
            <span className="text-red-500 font-marker text-2xl md:text-3xl mb-2 block">
              ERROR DE CONEXIÓN
            </span>
            <p className="text-gray-300 font-mono text-sm md:text-base">
              Fallo al contactar a los servidores.
            </p>
          </div>
        ) : (
          <>
            {/* 🚀 Renderizado condicional si no hay resultados */}
            {data.pages[0].results.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-gray-800 bg-gray-900/50">
                <span className="font-marker text-xl md:text-2xl text-gray-500 block mb-2">
                  ZONA VACÍA
                </span>
                <p className="font-mono text-gray-400 text-sm md:text-base">
                  No se encontró ningún estudio llamado{" "}
                  <span className="text-jinx-pink">{debouncedSearchTerm}</span>
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 animate-in fade-in duration-300">
                {data.pages.map((page, index) => (
                  <Fragment key={index}>
                    {page.results.map((developer) => (
                      <DeveloperCard key={developer.id} developer={developer} />
                    ))}
                  </Fragment>
                ))}
              </div>
            )}

            <div
              ref={loadMoreRef}
              className="w-full h-16 mt-8 flex items-center justify-center"
            >
              {isFetchingNextPage && (
                <span className="font-marker text-lg md:text-2xl tracking-widest text-jinx-pink animate-pulse">
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

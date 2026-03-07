import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Monitor,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import clsx from "clsx";

// 🚀 IMPORTACIONES DE ARQUITECTURA
import { useSearchResults } from "../../hooks/useSearch";
import { SORT_OPTIONS, PLATFORM_FAMILIES } from "../../utils/filtersData";
import GameCard from "../../components/common/GameCard";

// ASSETS IMPORTS
import BrushPink from "../../assets/images/brush_royal_pink.webp";
import PinkPaint from "../../assets/images/pink_paint.webp";
import XGreen from "../../assets/images/X_green.webp";

// --- FONDO MURAL OPTIMIZADO ---
// 🚀 OPTIMIZACIÓN: memo() aísla el fondo. Cuando la URL cambie, este componente ni se inmutará.
const SearchBackground = memo(() => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-gray-950 transform-gpu">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black opacity-90" />
    <img
      src={PinkPaint}
      alt=""
      loading="lazy"
      decoding="async"
      className="absolute top-[10%] left-[10%] w-[40%] h-[40%] object-cover opacity-[0.03] rotate-45 transform-gpu"
    />
    <img
      src={XGreen}
      alt=""
      loading="lazy"
      decoding="async"
      className="absolute bottom-10 right-10 w-32 opacity-[0.05] rotate-12 transform-gpu"
    />
  </div>
));
SearchBackground.displayName = "SearchBackground";

// --- COMPONENTE ACORDEÓN ---
const PlatformAccordion = ({ family, activePlatforms, togglePlatform }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasActiveFilter = family.platforms.some((p) =>
    activePlatforms.includes(p.id),
  );

  return (
    <div className="border-b border-gray-800 py-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left text-gray-300 hover:text-white transition-colors focus:outline-none py-3"
      >
        <span
          className={clsx(
            "flex items-center gap-2 font-mono text-sm md:text-base",
            hasActiveFilter && "text-zaun-green font-bold",
          )}
        >
          {family.icon} {family.name}
        </span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {isOpen && (
        <div className="flex flex-col gap-3 md:gap-2 mt-1 mb-3 pl-6">
          {family.platforms.map((platform) => {
            const isActive = activePlatforms.includes(platform.id);
            return (
              <label
                key={platform.id}
                className="flex items-center gap-3 cursor-pointer group py-1.5 md:py-1"
              >
                <div
                  className={clsx(
                    "w-5 h-5 md:w-4 md:h-4 border-2 flex items-center justify-center transition-colors shrink-0",
                    isActive
                      ? "bg-zaun-green border-zaun-green"
                      : "bg-black border-gray-600 group-hover:border-zaun-green",
                  )}
                >
                  {isActive && <X size={12} className="text-black font-bold" />}
                </div>
                <span
                  className={clsx(
                    "text-sm md:text-base select-none transition-colors",
                    isActive
                      ? "text-white font-bold"
                      : "text-gray-400 group-hover:text-gray-200",
                  )}
                >
                  {platform.label}
                </span>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={isActive}
                  onChange={() => togglePlatform(platform.id)}
                />
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL SEARCH
// ============================================================================
const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const queryParam = searchParams.get("q") || "";
  const sortParam = searchParams.get("sort") || "";
  const platformsParam = searchParams.get("platforms") || "";
  const genresParam = searchParams.get("genres") || "";
  const developersParam = searchParams.get("developers") || "";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  // 🚀 OPTIMIZACIÓN: useMemo evita que el array se regenere en cada render
  const activePlatforms = useMemo(() => {
    return platformsParam ? platformsParam.split(",") : [];
  }, [platformsParam]);

  useEffect(() => {
    if (showMobileFilters && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showMobileFilters]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pageParam]);

  // 🚀 OPTIMIZACIÓN: useCallback congela las funciones en memoria
  const updateFilter = useCallback(
    (key, value) => {
      const newParams = new URLSearchParams(searchParams);
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      if (key !== "page") newParams.set("page", "1");
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams],
  );

  const togglePlatform = useCallback(
    (id) => {
      let newPlatforms = [...activePlatforms];
      if (newPlatforms.includes(id)) {
        newPlatforms = newPlatforms.filter((p) => p !== id);
      } else {
        newPlatforms.push(id);
      }
      updateFilter("platforms", newPlatforms.join(","));
    },
    [activePlatforms, updateFilter],
  );

  const clearAllFilters = useCallback(() => {
    const newParams = new URLSearchParams();
    if (queryParam) newParams.set("q", queryParam);
    if (genresParam) newParams.set("genres", genresParam);
    if (developersParam) newParams.set("developers", developersParam);
    setSearchParams(newParams);
    setShowMobileFilters(false);
  }, [queryParam, genresParam, developersParam, setSearchParams]);

  const { data, isLoading, isError, isPlaceholderData } = useSearchResults({
    query: queryParam,
    sort: sortParam,
    platforms: platformsParam,
    genres: genresParam,
    developers: developersParam,
    page: pageParam,
  });

  const games = data?.results || [];
  const totalPages = Math.min(Math.ceil((data?.count || 0) / 12), 100);

  return (
    <section className="relative w-full min-h-screen pt-8 md:pt-12 pb-20 px-4 md:px-8 text-white">
      <SearchBackground />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row gap-6 md:gap-8">
        {/* PANEL LATERAL DE FILTROS */}
        <aside
          className={clsx(
            "transition-all duration-300 z-200 flex flex-col gap-6",
            showMobileFilters
              ? "fixed inset-0 bg-gray-950 p-6 overflow-y-auto"
              : "hidden md:flex md:sticky md:top-28 md:w-72 md:shrink-0 md:bg-gray-900 md:border-2 md:border-gray-800 md:p-6 md:shadow-[8px_8px_0_#000] md:h-fit",
          )}
        >
          <div className="flex justify-between items-center border-b-2 border-gray-800 pb-4">
            <h3 className="font-marker text-2xl flex items-center gap-2">
              <Filter size={20} className="text-zaun-green" /> FILTROS
            </h3>
            <div className="flex items-center gap-4">
              <button
                onClick={clearAllFilters}
                className="px-2 py-1 border border-jinx-pink text-jinx-pink hover:bg-jinx-pink hover:text-white font-bold text-[10px] tracking-widest uppercase transition-all shadow-[2px_2px_0_#000] active:translate-y-0.5 active:shadow-none"
              >
                LIMPIAR
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="md:hidden p-2 bg-jinx-pink text-white border-2 border-black rounded shadow-[2px_2px_0_#000] active:translate-y-1 active:shadow-none"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-mono font-bold text-gray-400 mb-3 text-sm flex items-center gap-2">
              <SlidersHorizontal size={14} /> ORDENAR POR
            </h4>
            <select
              className="w-full h-12 md:h-10 bg-black border-2 border-gray-700 text-white px-3 font-mono text-sm focus:border-zaun-green focus:outline-none transition-colors cursor-pointer appearance-none"
              value={sortParam}
              onChange={(e) => updateFilter("sort", e.target.value)}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="pb-10 md:pb-0">
            <h4 className="font-mono font-bold text-gray-400 mb-3 text-sm flex items-center gap-2">
              <Monitor size={14} /> PLATAFORMAS
            </h4>
            <div className="flex flex-col">
              {PLATFORM_FAMILIES.map((family) => (
                <PlatformAccordion
                  key={family.name}
                  family={family}
                  activePlatforms={activePlatforms}
                  togglePlatform={togglePlatform}
                />
              ))}
            </div>
          </div>

          {showMobileFilters && (
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-950 border-t-2 border-gray-800 md:hidden z-50">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-4 bg-zaun-green text-black font-black tracking-widest text-lg border-2 border-black shadow-[4px_4px_0_#000] active:translate-y-1 active:shadow-none"
              >
                VER {data?.count ? data.count.toLocaleString() : "0"} RESULTADOS
              </button>
            </div>
          )}
        </aside>

        {/* ÁREA PRINCIPAL DE RESULTADOS */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex flex-col mb-6 md:mb-8 gap-4">
            <div className="relative w-full">
              <img
                src={BrushPink}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute -top-2 -left-4 md:-left-6 w-24 md:w-32 opacity-20 -rotate-2 pointer-events-none transform-gpu"
              />
              <h2 className="font-marker text-3xl sm:text-4xl md:text-5xl relative z-10 text-white leading-tight">
                {queryParam ? (
                  <>
                    RESULTADOS: <br className="md:hidden" />
                    <span className="text-jinx-pink wrap-break-word">
                      &apos;{queryParam}&apos;
                    </span>
                  </>
                ) : genresParam ? (
                  <>
                    JUEGOS DEL <br className="md:hidden" />
                    <span className="text-zaun-green text-stroke-black">
                      GÉNERO ELEGIDO
                    </span>
                  </>
                ) : (
                  <>
                    EXPLORAR{" "}
                    <span className="text-zaun-green text-stroke-black">
                      CATÁLOGO
                    </span>
                  </>
                )}
              </h2>
              {data?.count > 0 && (
                <p className="font-mono text-gray-400 mt-2 text-sm md:text-base">
                  Se encontraron{" "}
                  <span className="text-jinx-pink font-black">
                    {data.count.toLocaleString()}
                  </span>{" "}
                  juegos
                </p>
              )}
            </div>

            <button
              className="md:hidden w-full flex items-center justify-center gap-2 px-4 py-3 bg-jinx-pink text-white font-bold tracking-widest text-lg border-2 border-black shadow-[4px_4px_0_#000] active:translate-y-1 active:shadow-none mt-2"
              onClick={() => setShowMobileFilters(true)}
            >
              <Filter size={20} /> FILTRAR RESULTADOS
              {activePlatforms.length > 0 && (
                <span className="bg-black text-jinx-pink px-2 py-0.5 rounded-full text-xs ml-2">
                  {activePlatforms.length}
                </span>
              )}
            </button>
          </div>

          {/* GRID DE JUEGOS */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-100 md:h-125 bg-gray-900 rounded-lg animate-pulse border border-gray-800"
                ></div>
              ))}
            </div>
          ) : isError ? (
            <div className="p-8 border-4 border-red-600 bg-gray-900 shadow-[4px_4px_0_#dc2626] md:shadow-[8px_8px_0_#dc2626] text-center">
              <span className="text-red-500 font-marker text-2xl md:text-3xl mb-2">
                ERROR DE CONEXIÓN
              </span>
            </div>
          ) : games.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 md:p-12 bg-gray-900/50 border-2 border-dashed border-gray-700">
              <h3 className="font-marker text-xl md:text-2xl text-gray-400 text-center">
                NO HAY RESULTADOS
              </h3>
              <p className="text-gray-500 font-mono mt-2 text-center text-sm md:text-base">
                No encontramos nada para tu búsqueda. Intenta con otros filtros.
              </p>
            </div>
          ) : (
            <>
              <div
                className={clsx(
                  "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 transition-opacity duration-200 transform-gpu",
                  isPlaceholderData ? "opacity-50" : "opacity-100",
                )}
              >
                {games.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>

              {/* PAGINACIÓN INFERIOR */}
              <div className="mt-12 md:mt-16 flex flex-wrap justify-center items-center gap-3 sm:gap-4 px-2">
                <button
                  onClick={() =>
                    updateFilter("page", Math.max(pageParam - 1, 1).toString())
                  }
                  disabled={pageParam === 1}
                  className="p-3 bg-gray-900 border-2 border-gray-700 text-white hover:border-jinx-pink hover:text-jinx-pink disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-[4px_4px_0_#000] shrink-0 active:translate-y-1 active:shadow-none"
                >
                  <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                </button>

                <span className="font-mono text-gray-400 text-sm md:text-base bg-gray-900 px-4 md:px-6 py-2 border-2 border-gray-800 shadow-[4px_4px_0_#000] rounded-full shrink-0">
                  <span className="text-white font-bold text-lg md:text-xl mr-1">
                    {pageParam}
                  </span>{" "}
                  / {totalPages}
                </span>

                <button
                  onClick={() =>
                    updateFilter("page", (pageParam + 1).toString())
                  }
                  disabled={pageParam === totalPages || isPlaceholderData}
                  className="p-3 bg-gray-900 border-2 border-gray-700 text-white hover:border-zaun-green hover:text-zaun-green disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-[4px_4px_0_#000] shrink-0 active:translate-y-1 active:shadow-none"
                >
                  <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default SearchResults;

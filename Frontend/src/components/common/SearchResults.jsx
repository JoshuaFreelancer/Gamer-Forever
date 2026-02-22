import { useState, useEffect } from "react";
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
import GameCard from "../../components/common/GameCard"; // Tu nuevo componente global

// ASSETS IMPORTS (Convertidos a webp para máximo rendimiento)
import BrushPink from "../../assets/images/brush_royal_pink.webp";
import PinkPaint from "../../assets/images/pink_paint.webp";
import XGreen from "../../assets/images/X_green.webp";

// --- FONDO MURAL OPTIMIZADO ---
const SearchBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-gray-950 transform-gpu">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black opacity-90" />
    <img
      src={PinkPaint}
      alt=""
      loading="lazy"
      decoding="async"
      className="absolute top-[10%] left-[10%] w-[40%] h-[40%] object-cover opacity-[0.03] rotate-45"
    />
    <img
      src={XGreen}
      alt=""
      loading="lazy"
      decoding="async"
      className="absolute bottom-10 right-10 w-32 opacity-[0.05] rotate-12"
    />
  </div>
);

// --- COMPONENTE ACORDEÓN ---
const PlatformAccordion = ({ family, activePlatforms, togglePlatform }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasActiveFilter = family.platforms.some((p) =>
    activePlatforms.includes(p.id),
  );

  return (
    <div className="border-b border-gray-800 py-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left text-gray-300 hover:text-white transition-colors focus:outline-none"
      >
        <span
          className={clsx(
            "flex items-center gap-2 font-mono text-sm",
            hasActiveFilter && "text-zaun-green font-bold",
          )}
        >
          {family.icon} {family.name}
        </span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <div className="flex flex-col gap-2 mt-3 pl-6">
          {family.platforms.map((platform) => {
            const isActive = activePlatforms.includes(platform.id);
            return (
              <label
                key={platform.id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div
                  className={clsx(
                    "w-4 h-4 border-2 flex items-center justify-center transition-colors",
                    isActive
                      ? "bg-zaun-green border-zaun-green"
                      : "bg-black border-gray-600 group-hover:border-zaun-green",
                  )}
                >
                  {isActive && <X size={10} className="text-black font-bold" />}
                </div>
                <span
                  className={clsx(
                    "text-sm select-none transition-colors",
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

  // Extracción de parámetros de la URL
  const queryParam = searchParams.get("q") || "";
  const sortParam = searchParams.get("sort") || "";
  const platformsParam = searchParams.get("platforms") || "";
  const genresParam = searchParams.get("genres") || "";
  const developersParam = searchParams.get("developers") || "";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  const activePlatforms = platformsParam ? platformsParam.split(",") : [];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pageParam]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key !== "page") newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const togglePlatform = (id) => {
    let newPlatforms = [...activePlatforms];
    if (newPlatforms.includes(id)) {
      newPlatforms = newPlatforms.filter((p) => p !== id);
    } else {
      newPlatforms.push(id);
    }
    updateFilter("platforms", newPlatforms.join(","));
  };

  const clearAllFilters = () => {
    const newParams = new URLSearchParams();
    if (queryParam) newParams.set("q", queryParam);
    if (genresParam) newParams.set("genres", genresParam);
    if (developersParam) newParams.set("developers", developersParam);
    setSearchParams(newParams);
  };

  // 🚀 LA MAGIA DEL HOOK CON LOS PARÁMETROS EMPAQUETADOS
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
    <section className="relative w-full min-h-screen pt-18 pb-20 px-4 md:px-8 text-white">
      <SearchBackground />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row gap-8">
        {/* PANEL LATERAL DE FILTROS */}
        <aside
          className={clsx(
            "md:w-72 shrink-0 flex flex-col gap-6 bg-gray-900 border-2 border-gray-800 p-6 shadow-[8px_8px_0_#000] h-fit transition-all duration-300 z-20",
            showMobileFilters
              ? "fixed inset-0 m-4 overflow-y-auto"
              : "hidden md:flex",
          )}
        >
          <div className="flex justify-between items-center border-b-2 border-gray-800 pb-4">
            <h3 className="font-marker text-2xl flex items-center gap-2">
              <Filter size={20} className="text-zaun-green" /> FILTROS
            </h3>
            <div className="flex gap-4">
              <button
                onClick={clearAllFilters}
                className="px-2 py-1 border border-jinx-pink text-jinx-pink hover:bg-jinx-pink hover:text-white font-bold text-[10px] tracking-widest uppercase transition-all shadow-[2px_2px_0_#000] active:translate-y-0.5 active:shadow-none"
              >
                LIMPIAR
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="md:hidden text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-mono font-bold text-gray-400 mb-3 text-sm flex items-center gap-2">
              <SlidersHorizontal size={14} /> ORDENAR POR
            </h4>
            <select
              className="w-full bg-black border-2 border-gray-700 text-white p-2 font-mono text-sm focus:border-zaun-green focus:outline-none transition-colors cursor-pointer appearance-none"
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

          <div>
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
        </aside>

        {/* ÁREA PRINCIPAL DE RESULTADOS */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
            <div className="relative">
              <img
                src={BrushPink}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute -top-2 -left-6 w-32 opacity-20 -rotate-2 pointer-events-none"
              />
              <h2 className="font-marker text-3xl md:text-5xl relative z-10 text-white leading-tight">
                {queryParam ? (
                  <>
                    RESULTADOS: <br className="md:hidden" />
                    <span className="text-jinx-pink break-all">
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
                <p className="font-mono text-gray-400 mt-2">
                  Se encontraron{" "}
                  <span className="text-jinx-pink font-black">
                    {data.count.toLocaleString()}
                  </span>{" "}
                  juegos
                </p>
              )}
            </div>

            <button
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-jinx-pink text-white font-bold tracking-widest border-2 border-black shadow-[4px_4px_0_#000] active:translate-y-1 active:shadow-none"
              onClick={() => setShowMobileFilters(true)}
            >
              <Filter size={18} /> FILTRAR
            </button>
          </div>

          {/* GRID DE JUEGOS */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-80 bg-gray-900 rounded-lg animate-pulse border border-gray-800"
                ></div>
              ))}
            </div>
          ) : isError ? (
            <div className="p-8 border-4 border-red-600 bg-gray-900 shadow-[8px_8px_0_#dc2626] text-center">
              <span className="text-red-500 font-marker text-3xl mb-2">
                ERROR DE CONEXIÓN
              </span>
            </div>
          ) : games.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-gray-900/50 border-2 border-dashed border-gray-700">
              <h3 className="font-marker text-2xl text-gray-400">
                NO HAY RESULTADOS
              </h3>
              <p className="text-gray-500 font-mono mt-2 text-center">
                No encontramos nada para tu búsqueda. Intenta con otros filtros.
              </p>
            </div>
          ) : (
            <>
              <div
                className={clsx(
                  "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 transition-opacity duration-200",
                  isPlaceholderData ? "opacity-50" : "opacity-100",
                )}
              >
                {games.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>

              {/* PAGINACIÓN INFERIOR */}
              <div className="mt-16 flex justify-center items-center gap-4">
                <button
                  onClick={() =>
                    updateFilter("page", Math.max(pageParam - 1, 1).toString())
                  }
                  disabled={pageParam === 1}
                  className="p-3 bg-gray-900 border-2 border-gray-700 text-white hover:border-jinx-pink hover:text-jinx-pink disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-[4px_4px_0_#000]"
                >
                  <ChevronLeft size={24} />
                </button>
                <span className="font-mono text-gray-400">
                  <span className="text-white font-bold text-xl">
                    {pageParam}
                  </span>{" "}
                  / {totalPages}
                </span>
                <button
                  onClick={() =>
                    updateFilter("page", (pageParam + 1).toString())
                  }
                  disabled={pageParam === totalPages || isPlaceholderData}
                  className="p-3 bg-gray-900 border-2 border-gray-700 text-white hover:border-zaun-green hover:text-zaun-green disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-[4px_4px_0_#000]"
                >
                  <ChevronRight size={24} />
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

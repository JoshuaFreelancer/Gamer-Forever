import { useState, useEffect, useRef, useMemo, memo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Star,
  Zap,
  Loader2,
  Filter,
  Monitor,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { FaPlaystation, FaXbox, FaAndroid } from "react-icons/fa";
import { SiNintendoswitch } from "react-icons/si";
import clsx from "clsx";

// ASSETS IMPORTS
import BrushPink from "../../src/assets/images/brush_royal_pink.png";
import PinkPaint from "../../src/assets/images/pink_paint.png";
import XGreen from "../../src/assets/images/X_green.png";

const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

// --- DICCIONARIOS DE FILTROS AGRUPADOS ---
const SORT_OPTIONS = [
  { label: "Relevancia", value: "" },
  { label: "Fecha de Agregado", value: "-added" },
  { label: "Nombre (A-Z)", value: "name" },
  { label: "Fecha de Lanzamiento", value: "-released" },
  { label: "Rating Promedio", value: "-rating" },
];

const PLATFORM_FAMILIES = [
  {
    name: "PC / OS",
    icon: <Monitor size={16} />,
    platforms: [
      { id: "4", label: "PC" },
      { id: "5", label: "macOS" },
      { id: "6", label: "Linux" },
    ],
  },
  {
    name: "PlayStation",
    icon: <FaPlaystation size={16} />,
    platforms: [
      { id: "187", label: "PlayStation 5" },
      { id: "18", label: "PlayStation 4" },
      { id: "16", label: "PlayStation 3" },
      { id: "15", label: "PlayStation 2" },
      { id: "27", label: "PlayStation 1" },
      { id: "19", label: "PS Vita" },
    ],
  },
  {
    name: "Xbox",
    icon: <FaXbox size={16} />,
    platforms: [
      { id: "186", label: "Xbox Series S/X" },
      { id: "1", label: "Xbox One" },
      { id: "14", label: "Xbox 360" },
      { id: "80", label: "Xbox Original" },
    ],
  },
  {
    name: "Nintendo",
    icon: <SiNintendoswitch size={16} />,
    platforms: [
      { id: "7", label: "Nintendo Switch" },
      { id: "10", label: "Wii U" },
      { id: "11", label: "Wii" },
      { id: "105", label: "GameCube" },
      { id: "8", label: "Nintendo 3DS" },
      { id: "9", label: "Nintendo DS" },
    ],
  },
  {
    name: "Móviles",
    icon: <FaAndroid size={16} />,
    platforms: [
      { id: "21", label: "Android" },
      { id: "3", label: "iOS" },
    ],
  },
];

// --- HELPER IMÁGENES ---
const getCroppedImageUrl = (url) => {
  if (!url) return "";
  const target = "media/";
  const index = url.indexOf(target) + target.length;
  return url.slice(0, index) + "crop/600/400/" + url.slice(index);
};

// --- FONDO MURAL OPTIMIZADO ---
const SearchBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-gray-950 transform-gpu">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black opacity-90" />
    <img
      src={PinkPaint}
      alt=""
      loading="lazy"
      className="absolute top-[10%] left-[10%] w-[40%] h-[40%] object-cover opacity-[0.03] rotate-45"
    />
    <img
      src={XGreen}
      alt=""
      loading="lazy"
      className="absolute bottom-10 right-10 w-32 opacity-[0.05] rotate-12"
    />
  </div>
);

// --- COMPONENTE ACORDEÓN PARA FAMILIAS DE PLATAFORMAS ---
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
// COMPONENTE GAMECARD
// ============================================================================
const GameCard = memo(({ game }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeMedia, setActiveMedia] = useState("static");
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const timerRef = useRef(null);
  const videoRef = useRef(null);
  const LOW_SPEC_MODE = true;

  const videoSrc = LOW_SPEC_MODE
    ? null
    : game.clip?.clips?.["320"] || game.clip?.clip || null;
  const screenshots = useMemo(
    () => game.short_screenshots?.map((s) => s.image).slice(0, 5) || [],
    [game.short_screenshots],
  );
  const mainImage = useMemo(
    () => getCroppedImageUrl(game.background_image),
    [game.background_image],
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
    timerRef.current = setTimeout(() => {
      if (videoSrc) {
        setIsLoadingMedia(true);
        setActiveMedia("video");
      } else if (screenshots.length > 1) {
        setActiveMedia("carousel");
      }
    }, 600);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setActiveMedia("static");
    setIsLoadingMedia(false);
    setCarouselIndex(0);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  useEffect(() => {
    let interval;
    if (activeMedia === "carousel") {
      interval = setInterval(
        () => setCarouselIndex((p) => (p + 1) % screenshots.length),
        1500,
      );
    }
    return () => clearInterval(interval);
  }, [activeMedia, screenshots.length]);

  useEffect(() => {
    if (activeMedia === "video" && videoRef.current) {
      videoRef.current.currentTime = 0;
      setTimeout(() => {
        videoRef.current?.play().catch(() => {
          setIsLoadingMedia(false);
          setActiveMedia(screenshots.length > 1 ? "carousel" : "static");
        });
      }, 50);
    }
  }, [activeMedia, screenshots.length]);

  return (
    <div
      className="group relative bg-gray-900 border-2 border-gray-800 hover:border-jinx-pink transition-[transform,border-color,box-shadow] duration-200 rounded-lg overflow-hidden flex flex-col h-full hover:shadow-[8px_8px_0_#000] hover:-translate-y-1 will-change-[transform,border-color]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative h-48 w-full overflow-hidden bg-black border-b-2 border-gray-800">
        <img
          src={mainImage}
          alt={game.name}
          loading="lazy"
          className={clsx(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-300 will-change-opacity",
            activeMedia !== "static" && !isLoadingMedia
              ? "opacity-0"
              : "opacity-100",
          )}
        />
        {activeMedia === "carousel" && (
          <img
            src={getCroppedImageUrl(screenshots[carouselIndex])}
            alt="Slide"
            className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-300"
          />
        )}
        {activeMedia === "video" && videoSrc && (
          <video
            ref={videoRef}
            src={videoSrc}
            muted
            playsInline
            loop
            onCanPlay={() => setIsLoadingMedia(false)}
            className={clsx(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-300 will-change-opacity",
              isLoadingMedia ? "opacity-0" : "opacity-100",
            )}
          />
        )}
        {isLoadingMedia && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
            <Loader2 className="animate-spin text-jinx-pink w-8 h-8" />
          </div>
        )}
        <div
          className={clsx(
            "absolute inset-0 bg-black/20 transition-opacity duration-200 pointer-events-none will-change-opacity",
            isHovered ? "opacity-0" : "opacity-100",
          )}
        />
        <div className="absolute top-2 right-2 bg-gray-900 px-2 py-1 rounded border border-zaun-green flex items-center gap-1 z-10 shadow-[2px_2px_0_#000]">
          <Star size={12} className="text-zaun-green fill-zaun-green" />
          <span className="text-xs font-bold text-white">{game.rating}</span>
        </div>
      </div>

      <div className="p-4 flex flex-col grow relative bg-gray-900 pointer-events-none">
        <h3
          className="font-marker text-xl text-white mb-2 leading-none group-hover:text-jinx-pink transition-colors duration-200 line-clamp-2"
          title={game.name}
        >
          {game.name}
        </h3>
        <div className="flex flex-col gap-1 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar size={12} />
            <span>
              {game.released
                ? new Date(game.released).toLocaleDateString()
                : "TBA"}
            </span>
          </div>
        </div>
        <div className="mt-auto pt-4 border-t border-gray-800 pointer-events-auto">
          <Link
            to={`/game/${game.id}`}
            className="relative w-full py-2 bg-jinx-pink text-white font-bold tracking-widest overflow-hidden group/btn hover:brightness-110 transition-[filter,transform] border-2 border-black shadow-[4px_4px_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none block text-center"
          >
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[repeating-linear-gradient(45deg,#000_0,#000_2px,transparent_2px,transparent_8px)]" />
            <span className="relative z-10 flex items-center justify-center gap-2 font-marker text-md skew-x-[-5deg]">
              DETALLES{" "}
              <Zap
                size={14}
                className="fill-white group-hover/btn:scale-110 transition-transform will-change-transform"
              />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
});
GameCard.displayName = "GameCard";

// ============================================================================
// COMPONENTE PRINCIPAL SEARCH
// ============================================================================
const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Parámetros activos de la URL
  const queryParam = searchParams.get("q") || "";
  const sortParam = searchParams.get("sort") || "";
  const platformsParam = searchParams.get("platforms") || "";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  const activePlatforms = platformsParam ? platformsParam.split(",") : [];

  // 🚀 AJUSTE 1: Scroll al inicio al cambiar de página
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pageParam]);

  // Actualizador de URL genérico
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
    setSearchParams(new URLSearchParams(queryParam ? { q: queryParam } : {}));
  };

  // Fetch a RAWG
  const fetchSearch = async () => {
    if (!API_KEY) throw new Error("API Key missing");
    let url = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=12&page=${pageParam}`;

    if (queryParam) url += `&search=${queryParam}`;
    if (sortParam) url += `&ordering=${sortParam}`;
    if (platformsParam) url += `&platforms=${platformsParam}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Error en la búsqueda");
    return res.json();
  };

  const { data, isLoading, isError, isPlaceholderData } = useQuery({
    queryKey: [
      "searchResults",
      queryParam,
      sortParam,
      platformsParam,
      pageParam,
    ],
    queryFn: fetchSearch,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  const games = data?.results || [];
  const totalPages = Math.min(Math.ceil((data?.count || 0) / 12), 100);

  return (
    <section className="relative w-full min-h-screen pt-18 pb-20 px-4 md:px-8 text-white">
      <SearchBackground />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row gap-8">
        {/* PANEL LATERAL DE FILTROS (Sidebar) */}
        <aside
          className={clsx(
            "md:w-72 shrink-0 flex flex-col gap-6 bg-gray-900 border-2 border-gray-800 p-6 shadow-[8px_8px_0_#000] h-fit transition-all duration-300 z-20",
            showMobileFilters
              ? "fixed inset-0 m-4 overflow-y-auto"
              : "hidden md:flex",
          )}
        >
          {/* Cabecera del Sidebar */}
          <div className="flex justify-between items-center border-b-2 border-gray-800 pb-4">
            <h3 className="font-marker text-2xl flex items-center gap-2">
              <Filter size={20} className="text-zaun-green" /> FILTROS
            </h3>

            <div className="flex gap-4">
              {/* 🚀 AJUSTE 2: Botón de Limpiar más visible y con estilo radical */}
              <button
                onClick={clearAllFilters}
                className="px-2 py-1 border border-jinx-pink text-jinx-pink hover:bg-jinx-pink hover:text-white font-bold text-[10px] tracking-widest uppercase transition-all shadow-[2px_2px_0_#000] active:translate-y-0.5 active:shadow-none"
              >
                LIMPIAR
              </button>
              {/* Botón de cierre solo en móvil */}
              <button
                onClick={() => setShowMobileFilters(false)}
                className="md:hidden text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* ORDENAR POR */}
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

          {/* PLATAFORMAS (Acordeones por familia) */}
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
          {/* CABECERA DINÁMICA DE RESULTADOS */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
            <div className="relative">
              <img
                src={BrushPink}
                alt=""
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
                    {data.count}
                  </span>{" "}
                  juegos
                </p>
              )}
            </div>

            {/* Botón Filtros Móvil */}
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
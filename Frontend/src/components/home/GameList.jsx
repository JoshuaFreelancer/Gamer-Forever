import { useState, useEffect, useRef, useMemo, memo } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  FaPlaystation,
  FaXbox,
  FaWindows,
  FaApple,
  FaLinux,
  FaAndroid,
} from "react-icons/fa";
import { SiNintendoswitch, SiIos } from "react-icons/si";
import {
  Gamepad2,
  Calendar,
  Star,
  ChevronLeft,
  ChevronRight,
  Zap,
  Video,
  Loader2,
  PlayCircle,
} from "lucide-react";
import clsx from "clsx";
import { Link } from "react-router-dom";

// ASSETS IMPORTS
import BrushPink from "../../assets/images/brush_royal_pink.png";
import XGreen from "../../assets/images/XX_green_face.png";
import PinkPaint from "../../assets/images/pink_paint.png";

// 🔒 SEGURIDAD
const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

// --- HELPER IMÁGENES ---
const getCroppedImageUrl = (url) => {
  if (!url) return "";
  const target = "media/";
  const index = url.indexOf(target) + target.length;
  return url.slice(0, index) + "crop/600/400/" + url.slice(index);
};

// --- FONDO MURAL (CAOS URBANO) - OPTIMIZADO ---
const BackgroundMural = () => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none bg-gray-950">
    {/* Fondo base con degradado CSS en lugar de blend modes pesados */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black opacity-90" />

    {/* Imágenes decorativas estáticas con opacidad controlada */}
    <img
      src={PinkPaint}
      alt=""
      loading="lazy"
      className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] object-cover opacity-[0.03] rotate-180"
    />
    <img
      src={BrushPink}
      alt=""
      loading="lazy"
      className="absolute top-[15%] right-[20%] w-96 opacity-[0.04] rotate-12"
    />
    <img
      src={XGreen}
      alt=""
      loading="lazy"
      className="absolute bottom-20 left-12 w-32 opacity-[0.05] -rotate-12"
    />
  </div>
);

// --- COMPONENTE: TARJETA DE JUEGO - SÚPER OPTIMIZADO ---
const GameCard = memo(({ game }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeMedia, setActiveMedia] = useState("static");
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const timerRef = useRef(null);
  const videoRef = useRef(null);

  // 🚀 MODO RENDIMIENTO: Cambia a 'false' si quieres probar el video en PCs potentes
  const LOW_SPEC_MODE = true;

  // Solo extraemos el video si NO estamos en modo de bajos recursos
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
    }, 600); // 600ms es buen tiempo para evitar disparos accidentales
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
      // Añadimos un pequeño timeout al play para no bloquear el renderizado inicial
      setTimeout(() => {
        videoRef.current?.play().catch(() => {
          setIsLoadingMedia(false);
          setActiveMedia(screenshots.length > 1 ? "carousel" : "static");
        });
      }, 50);
    }
  }, [activeMedia, screenshots.length]);

  const PlatformIcons = useMemo(() => {
    return game.parent_platforms?.map((p) => {
      const s = p.platform.slug.toLowerCase();
      let Icon = Gamepad2;
      if (s.includes("pc")) Icon = FaWindows;
      else if (s.includes("playstation")) Icon = FaPlaystation;
      else if (s.includes("xbox")) Icon = FaXbox;
      else if (s.includes("nintendo")) Icon = SiNintendoswitch;
      else if (s.includes("linux")) Icon = FaLinux;
      else if (s.includes("mac") || s.includes("apple")) Icon = FaApple;
      else if (s.includes("android")) Icon = FaAndroid;
      else if (s.includes("ios")) Icon = SiIos;
      return (
        <span
          key={p.platform.id}
          title={p.platform.name}
          className="hover:text-white transition-colors"
        >
          <Icon />
        </span>
      );
    });
  }, [game.parent_platforms]);

  return (
    <div
      // 🚀 OPTIMIZACIÓN: transition-all eliminado. Solo animamos lo que cambia.
      className="group relative bg-gray-900 border-2 border-gray-800 hover:border-jinx-pink transition-[transform,border-color,box-shadow] duration-200 rounded-lg overflow-hidden flex flex-col h-full hover:shadow-[8px_8px_0_#000] hover:-translate-y-1 will-change-[transform,border-color]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 1. AREA MULTIMEDIA */}
      <div className="relative h-64 w-full overflow-hidden bg-black border-b-2 border-gray-800">
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
            // No le ponemos loading="lazy" aquí para que el cambio del carrusel sea instantáneo
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

        {videoSrc && activeMedia !== "video" && !isLoadingMedia && (
          <div className="absolute top-2 left-2 z-20 bg-black/70 rounded-full p-1.5 border border-white/10 group-hover:scale-110 transition-transform will-change-transform">
            <PlayCircle size={20} className="text-white" />
          </div>
        )}

        {activeMedia === "video" && !isLoadingMedia && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-red-600 px-2 py-0.5 rounded text-[10px] font-bold text-white z-20">
            <Video size={10} /> REC
          </div>
        )}

        {activeMedia === "carousel" && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-20">
            {screenshots.map((_, idx) => (
              <div
                key={idx}
                className={clsx(
                  "h-1.5 rounded-full transition-[width,background-color] duration-300 border border-black will-change-[width]",
                  idx === carouselIndex ? "w-4 bg-jinx-pink" : "w-1.5 bg-white",
                )}
              />
            ))}
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

      {/* 2. CONTENIDO */}
      <div className="p-5 flex flex-col grow relative bg-gray-900 pointer-events-none">
        <div className="flex gap-3 text-gray-500 mb-2 text-sm">
          {PlatformIcons}
        </div>

        <h3
          className="font-marker text-2xl text-white mb-2 leading-none group-hover:text-jinx-pink transition-colors duration-200 line-clamp-1"
          title={game.name}
        >
          {game.name}
        </h3>

        <div className="flex flex-col gap-1 mb-6">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar size={12} />
            <span>
              {game.released
                ? new Date(game.released).toLocaleDateString()
                : "TBA"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 line-clamp-1">
            <span className="w-2 h-2 rounded-full bg-zaun-green inline-block"></span>
            <span>{game.genres?.map((g) => g.name).join(", ")}</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-800 pointer-events-auto">
          
            {/* Cambiamos el <button> por <Link> y le pasamos la ruta dinámica */}
            <Link
              to={`/game/${game.id}`}
              className="relative w-full py-3 bg-jinx-pink text-white font-bold tracking-widest overflow-hidden group/btn hover:brightness-110 transition-[filter,transform] border-2 border-black shadow-[4px_4px_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none block text-center"
            >
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[repeating-linear-gradient(45deg,#000_0,#000_2px,transparent_2px,transparent_8px)]" />

              <span className="relative z-10 flex items-center justify-center gap-2 font-marker text-lg skew-x-[-5deg]">
                VER DETALLES{" "}
                <Zap
                  size={18}
                  className="fill-white group-hover/btn:scale-110 transition-transform will-change-transform"
                />
              </span>
            </Link>
          </div>
        </div>
      </div>
  );
});

// Agregamos un displayName para que no salga como 'Anonymous' en las DevTools de React
GameCard.displayName = "GameCard";

// --- COMPONENTE PRINCIPAL ---
const GameList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 9;

  const fetchGames = async (page) => {
    if (!API_KEY) throw new Error("API Key missing");
    const res = await fetch(
      `https://api.rawg.io/api/games?key=${API_KEY}&ordering=-added&dates=2023-01-01,2025-12-31&page_size=${gamesPerPage}&page=${page}`,
    );
    if (!res.ok) throw new Error("Error fetching games");
    return res.json();
  };

  const { data, isLoading, isError, isPlaceholderData } = useQuery({
    queryKey: ["gamesList", currentPage],
    queryFn: () => fetchGames(currentPage),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 60,
  });

  const games = data?.results || [];
  const totalPages = Math.min(
    Math.ceil((data?.count || 0) / gamesPerPage),
    100,
  );
  const listRef = useRef(null);

  useEffect(() => {
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

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-20 relative flex flex-col items-center z-10">
        <div className="relative">
          <img
            src={BrushPink}
            alt=""
            loading="lazy"
            className="absolute -inset-4 w-[120%] h-[140%] object-contain opacity-90 -rotate-2 z-0"
          />
          <h2 className="relative z-10 font-marker text-5xl md:text-7xl text-white drop-shadow-[4px_4px_0_#000]">
            LISTA DE{" "}
            <span className="text-zaun-green text-stroke-black">JUEGOS</span>
          </h2>
        </div>
      </div>

      {/* GRID */}
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
              ERROR DE SISTEMA
            </span>
            <p className="text-gray-400 font-mono text-center">
              Fallo de conexión. Revisa tu API Key.
            </p>
          </div>
        ) : (
          <div
            className={clsx(
              "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-200",
              isPlaceholderData ? "opacity-50" : "opacity-100",
            )}
          >
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </div>

      {/* PAGINACIÓN - OPTIMIZADA */}
      {!isLoading && !isError && (
        <div className="max-w-7xl mx-auto mt-24 flex justify-center items-center gap-6 md:gap-8 z-10 relative">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            // 🚀 OPTIMIZACIÓN: Transiciones específicas, will-change y focus-visible para accesibilidad
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
            // 🚀 OPTIMIZACIÓN: Transiciones específicas y will-change
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

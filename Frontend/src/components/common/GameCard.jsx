import { useState, useEffect, useRef, useMemo, memo } from "react";
import { Link } from "react-router-dom";
import { Calendar, Star, Zap, Loader2, PlayCircle, Video } from "lucide-react";
import clsx from "clsx";

// 🚀 TUS HELPERS CENTRALIZADOS
import { getCroppedImageUrl } from "../../utils/imageCrop";
import { getPlatformIcon } from "../../utils/platformIcons";
import { GENRE_TRANSLATIONS } from "../../utils/translations";

// ============================================================================
// 🚀 1. MICRO-COMPONENTE AISLADO: GameMedia
// Todo el estado pesado (timers, video, carrusel) vive solo aquí.
// Cuando la imagen cambia, SOLO este cuadrito se repinta, no la tarjeta entera.
// ============================================================================
const GameMedia = memo(({ game, isHovered }) => {
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

  // Efecto Maestro: Escucha si la tarjeta padre está en "Hover"
  useEffect(() => {
    if (isHovered) {
      // Iniciar Hover
      timerRef.current = setTimeout(() => {
        if (videoSrc) {
          setIsLoadingMedia(true);
          setActiveMedia("video");
        } else if (screenshots.length > 1) {
          setActiveMedia("carousel");
        }
      }, 600);
    } else {
      // Detener Hover (Limpieza total)
      setActiveMedia("static");
      setIsLoadingMedia(false);
      setCarouselIndex(0);
      if (timerRef.current) clearTimeout(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isHovered, videoSrc, screenshots.length]);

  // Motor del Carrusel
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

  // Motor del Video
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
    <div className="relative aspect-video md:aspect-auto md:h-64 w-full overflow-hidden bg-black border-b-2 border-gray-800 shrink-0 transform-gpu">
      <img
        src={mainImage}
        alt={game.name}
        width="600"
        height="400"
        loading="lazy"
        decoding="async"
        className={clsx(
          "absolute inset-0 w-full h-full object-cover transition-opacity duration-300 transform-gpu",
          activeMedia !== "static" && !isLoadingMedia
            ? "opacity-0"
            : "opacity-100",
        )}
      />

      {activeMedia === "carousel" && (
        <img
          src={getCroppedImageUrl(screenshots[carouselIndex])}
          alt="Slide"
          width="600"
          height="400"
          decoding="async"
          // Usamos transform-gpu para que el navegador no repinte toda la tarjeta al cambiar la foto
          className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-300 transform-gpu"
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
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-300 transform-gpu",
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
        <div className="absolute top-2 left-2 z-20 bg-black/70 rounded-full p-1.5 border border-white/10 group-hover:scale-110 transition-transform transform-gpu">
          <PlayCircle className="w-4 h-4 md:w-5 md:h-5 text-white" />
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
                "h-1.5 rounded-full transition-[width,background-color] duration-300 border border-black transform-gpu",
                idx === carouselIndex ? "w-4 bg-jinx-pink" : "w-1.5 bg-white",
              )}
            />
          ))}
        </div>
      )}

      <div
        className={clsx(
          "absolute inset-0 bg-black/20 transition-opacity duration-200 pointer-events-none transform-gpu",
          isHovered ? "opacity-0" : "opacity-100",
        )}
      />

      <div className="absolute top-2 right-2 bg-gray-900 px-2 py-1 rounded border border-zaun-green flex items-center gap-1 z-10 shadow-[2px_2px_0_#000]">
        <Star size={12} className="text-zaun-green fill-zaun-green" />
        <span className="text-xs font-bold text-white">{game.rating}</span>
      </div>
    </div>
  );
});
GameMedia.displayName = "GameMedia";

// ============================================================================
// 🚀 2. COMPONENTE PRINCIPAL: GameCard (Limpio y Estático)
// ============================================================================
const GameCard = memo(({ game }) => {
  // El ÚNICO estado que le queda a la tarjeta es saber si tiene el ratón encima
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative bg-gray-900 border-2 border-gray-800 hover:border-jinx-pink transition-[transform,border-color,box-shadow] duration-200 rounded-lg overflow-hidden flex flex-col h-full shadow-[4px_4px_0_#000] md:shadow-none hover:shadow-[6px_6px_0_#000] md:hover:shadow-[8px_8px_0_#000] active:translate-y-1 md:active:translate-y-0 md:hover:-translate-y-1 transform-gpu"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Delegamos toda la lógica pesada al micro-componente */}
      <GameMedia game={game} isHovered={isHovered} />

      {/* CONTENIDO ESTÁTICO (¡Ya no se repintará inútilmente!) */}
      <div className="p-4 md:p-5 flex flex-col grow relative bg-gray-900 pointer-events-none">
        <div className="flex flex-wrap gap-2 md:gap-3 text-gray-500 mb-2 md:mb-3 text-sm">
          {game.parent_platforms?.map(({ platform }) => (
            <span
              key={platform.id}
              title={platform.name}
              className="hover:text-white transition-colors pointer-events-auto"
            >
              {getPlatformIcon(platform.slug, 16)}
            </span>
          ))}
        </div>

        <h3
          className="font-marker text-lg sm:text-xl md:text-2xl text-white mb-2 leading-tight group-hover:text-jinx-pink transition-colors duration-200 line-clamp-2"
          title={game.name}
        >
          {game.name}
        </h3>

        <div className="flex flex-col gap-1.5 mb-4 mt-auto">
          <div className="flex items-center gap-2 text-[11px] md:text-xs text-gray-400">
            <Calendar size={12} />
            <span>
              {game.released
                ? new Date(game.released).toLocaleDateString()
                : "TBA"}
            </span>
          </div>

          {game.genres && game.genres.length > 0 && (
            <div className="flex items-center gap-2 text-[11px] md:text-xs text-gray-400 line-clamp-1">
              <span className="w-1.5 h-1.5 rounded-full bg-zaun-green inline-block shrink-0"></span>
              <span className="truncate">
                {game.genres
                  .map((g) => GENRE_TRANSLATIONS[g.name] || g.name)
                  .join(", ")}
              </span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-gray-800 pointer-events-auto mt-auto">
          <Link
            to={`/game/${game.id}`}
            className="relative w-full py-2.5 md:py-3 bg-jinx-pink text-white font-bold tracking-widest overflow-hidden group/btn hover:brightness-110 transition-[filter,transform] border-2 border-black shadow-[4px_4px_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none block text-center transform-gpu"
          >
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[repeating-linear-gradient(45deg,#000_0,#000_2px,transparent_2px,transparent_8px)] transform-gpu" />
            <span className="relative z-10 flex items-center justify-center gap-2 font-marker text-[15px] md:text-lg skew-x-[-5deg] transform-gpu">
              VER DETALLES{" "}
              <Zap className="w-4 h-4 md:w-5 md:h-5 fill-white group-hover/btn:scale-110 transition-transform" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
});

GameCard.displayName = "GameCard";

export default GameCard;

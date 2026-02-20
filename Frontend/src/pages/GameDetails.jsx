import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  Star,
  Monitor,
  Users,
  Loader2,
  Play,
  ShoppingCart,
  Cpu,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  FaPlaystation,
  FaXbox,
  FaWindows,
  FaApple,
  FaLinux,
  FaAndroid,
  FaSteam,
  FaGooglePlay,
  FaAppStoreIos,
} from "react-icons/fa";
import {
  SiNintendoswitch,
  SiIos,
  SiEpicgames,
  SiGogdotcom,
} from "react-icons/si";
import clsx from "clsx";

// ASSETS IMPORTS
import BrushPink from "../../src/assets/images/brush_royal_pink.png";
import PinkPaint from "../../src/assets/images/pink_paint.png";

const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

// --- FONDO MURAL OPTIMIZADO PARA DETALLES ---
const DetailsBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-gray-950 transform-gpu">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black opacity-90" />
    <img
      src={PinkPaint}
      alt=""
      loading="lazy"
      className="absolute top-0 right-0 w-[50%] h-[50%] object-cover opacity-[0.03] rotate-90"
    />
  </div>
);

// --- COMPONENTE CARRUSEL LIGERO ---
const ScreenshotsCarousel = ({ screenshots }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!screenshots || screenshots.length === 0) return null;

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));

  return (
    <div className="relative mt-8 group">
      <h4 className="font-marker text-2xl text-white mb-4">GALERÍA</h4>
      <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-gray-800 shadow-[8px_8px_0_#000]">
        <img
          src={screenshots[currentIndex].image}
          alt="Screenshot"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />

        {/* Controles */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-jinx-pink text-white border-2 border-transparent hover:border-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity will-change-opacity"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-jinx-pink text-white border-2 border-transparent hover:border-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity will-change-opacity"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Miniaturas */}
      <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-800">
        {screenshots.map((shot, idx) => (
          <button
            key={shot.id}
            onClick={() => setCurrentIndex(idx)}
            className={`shrink-0 w-24 aspect-video rounded border-2 transition-colors ${currentIndex === idx ? "border-jinx-pink" : "border-gray-800 hover:border-gray-600"}`}
          >
            <img
              src={shot.image}
              alt=""
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

// --- HELPER PARA LIMPIAR EL IDIOMA DE LA SINOPSIS (V4 - PRECISO Y SEGURO) ---
const extractPreferredLanguage = (htmlString) => {
  if (!htmlString) return "Sin descripción disponible.";

  // Marcadores comunes de idiomas en la API de RAWG
  const spanishRegex =
    /(?:<[^>]+>)*\s*(?:Español|Spanish|Idioma Español)\s*[:-]?\s*(?:<[^>]+>)*/i;
  // Excluimos "EN" corto para no hacer falsos positivos con palabras en inglés.
  const otherLanguagesRegex =
    /(?:<[^>]+>)*\s*(?:English|Русский|Deutsch|Français|Italiano|Português|Polski|日本語|中文)\s*[:-]?\s*(?:<[^>]+>)*/i;

  // 1. Si existe la etiqueta de Español explícitamente (Ej: GTA V)
  if (spanishRegex.test(htmlString)) {
    let parts = htmlString.split(spanishRegex);
    let textAfterSpanish = parts[parts.length - 1]; // Tomamos el texto después de la etiqueta

    // Si después del español empieza otro idioma (ej. Ruso), lo cortamos
    let finalSpanishText = textAfterSpanish.split(otherLanguagesRegex)[0];

    // Si la extracción queda vacía por algún error de formato, mostramos el original
    return finalSpanishText.trim() || htmlString;
  }

  // 2. Si no hay Español explícito (Ej: Baldur's Gate 3)
  // Asumimos que el inicio es el idioma principal (Inglés).
  // Solo cortamos si más abajo empieza un bloque de traducciones como "Русский".
  let cleanedText = htmlString.split(otherLanguagesRegex)[0];

  // Si la limpieza accidentalmente dejó el texto muy corto, es un falso positivo. Devolvemos todo intacto.
  if (cleanedText.trim().length < 50) return htmlString;

  return cleanedText.trim();
};

// --- COMPONENTE READ MORE PARA LA SINOPSIS ---
const Synopsis = ({ content }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Asumimos que si el contenido tiene más de 500 caracteres, vale la pena cortarlo.
  const isLong = content.length > 500;

  return (
    <section>
      <div className="relative mb-6">
        <img
          src={BrushPink}
          alt=""
          className="absolute -top-4 -left-6 w-32 opacity-20 -rotate-6 pointer-events-none"
        />
        <h3 className="font-marker text-3xl text-jinx-pink relative z-10">
          SINOPSIS
        </h3>
      </div>

      <div className="relative">
        <div
          className={clsx(
            "prose prose-invert prose-lg max-w-none font-roboto text-gray-300 leading-relaxed transition-all duration-300",
            !isExpanded &&
              isLong &&
              "max-h-48 overflow-hidden mask-image-gradient-to-b",
          )}
          style={{
            // Usamos un gradiente CSS para difuminar el final del texto cuando está colapsado
            WebkitMaskImage:
              !isExpanded && isLong
                ? "linear-gradient(to bottom, black 50%, transparent 100%)"
                : "none",
            maskImage:
              !isExpanded && isLong
                ? "linear-gradient(to bottom, black 50%, transparent 100%)"
                : "none",
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {isLong && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 flex items-center gap-2 text-zaun-green hover:text-white font-bold tracking-widest transition-colors focus:outline-none"
          >
            {isExpanded ? (
              <>
                LEER MENOS <ChevronUp size={20} />
              </>
            ) : (
              <>
                LEER MÁS <ChevronDown size={20} />
              </>
            )}
          </button>
        )}
      </div>
    </section>
  );
};

const GameDetails = () => {
  const { id } = useParams();

  const fetchGameData = async (gameId) => {
    if (!API_KEY) throw new Error("Falta la API Key");

    const [detailsRes, screenshotsRes, moviesRes] = await Promise.all([
      fetch(`https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`),
      fetch(
        `https://api.rawg.io/api/games/${gameId}/screenshots?key=${API_KEY}`,
      ),
      fetch(`https://api.rawg.io/api/games/${gameId}/movies?key=${API_KEY}`),
    ]);

    if (!detailsRes.ok) throw new Error("Juego no encontrado");

    const details = await detailsRes.json();
    const screenshots = screenshotsRes.ok
      ? await screenshotsRes.json()
      : { results: [] };
    const movies = moviesRes.ok ? await moviesRes.json() : { results: [] };

    return {
      ...details,
      extraScreenshots: screenshots.results,
      extraMovies: movies.results,
    };
  };

  const {
    data: game,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["gameDetailsData", id],
    queryFn: () => fetchGameData(id),
    staleTime: 1000 * 60 * 60 * 24,
    enabled: !!id,
  });

  const getPlatformIcon = (slug) => {
    if (slug.includes("pc") || slug.includes("windows")) return <FaWindows />;
    if (slug.includes("playstation")) return <FaPlaystation />;
    if (slug.includes("xbox")) return <FaXbox />;
    if (slug.includes("nintendo")) return <SiNintendoswitch />;
    if (slug.includes("linux")) return <FaLinux />;
    if (slug.includes("mac")) return <FaApple />;
    if (slug.includes("android")) return <FaAndroid />;
    if (slug.includes("ios")) return <SiIos />;
    return <Monitor />;
  };

  const getStoreIcon = (slug) => {
    if (slug.includes("steam")) return <FaSteam />;
    if (slug.includes("epic")) return <SiEpicgames />;
    if (slug.includes("gog")) return <SiGogdotcom />;
    if (slug.includes("playstation")) return <FaPlaystation />;
    if (slug.includes("xbox")) return <FaXbox />;
    if (slug.includes("nintendo")) return <SiNintendoswitch />;
    if (slug.includes("apple")) return <FaAppStoreIos />;
    if (slug.includes("google")) return <FaGooglePlay />;
    return <ShoppingCart />;
  };

  const pcRequirements = useMemo(() => {
    if (!game) return null;
    const pcPlatform = game.platforms?.find((p) => p.platform.slug === "pc");
    return pcPlatform?.requirements_en || pcPlatform?.requirements_ru || null;
  }, [game]);

  const cleanDescription = useMemo(() => {
    if (!game) return "";
    return extractPreferredLanguage(game.description);
  }, [game]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-jinx-pink">
        <Loader2 className="animate-spin w-16 h-16 mb-4" />
        <p className="font-marker text-2xl animate-pulse text-white">
          EXTRAYENDO DATOS...
        </p>
      </div>
    );
  }

  if (isError || !game) return null;

  const mainTrailer =
    game.extraMovies && game.extraMovies.length > 0
      ? game.extraMovies[0].data.max
      : null;

  return (
    <section className="relative w-full min-h-screen pt-18 pb-20 px-4 md:px-8 text-white overflow-x-hidden">
      <DetailsBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 mb-8 text-gray-400 hover:text-jinx-pink font-bold tracking-widest transition-colors w-fit"
        >
          <ArrowLeft
            size={24}
            className="group-hover:-translate-x-1 transition-transform"
          />
          REGRESAR AL CATÁLOGO
        </Link>

        {/* HERO SECTION */}
        <div className="relative w-full h-80 md:h-125 rounded-2xl overflow-hidden border-4 border-gray-800 shadow-[12px_12px_0_#000] mb-12 flex items-end">
          <img
            src={game.background_image}
            alt={game.name}
            className="absolute inset-0 w-full h-full object-cover object-top transform-gpu opacity-60"
          />
          <div className="absolute inset-0 bg-linear-to-t from-gray-950 via-gray-900/50 to-transparent" />

          <div className="relative p-6 md:p-12 w-full z-10">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              {game.playtime > 0 && (
                <span className="px-3 py-1 bg-zaun-green text-black font-bold text-sm border-2 border-black shadow-[2px_2px_0_#000]">
                  {game.playtime} HORAS APROX.
                </span>
              )}
              {game.rating > 0 && (
                <div className="flex items-center gap-1 bg-gray-900 px-3 py-1 border-2 border-gray-700 shadow-[2px_2px_0_#000]">
                  <Star size={16} className="text-zaun-green fill-zaun-green" />
                  <span className="font-bold">{game.rating} / 5</span>
                </div>
              )}
            </div>
            <h1 className="font-marker text-5xl md:text-8xl text-white drop-shadow-[4px_4px_0_#000] leading-none">
              {game.name}
            </h1>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL - GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* COLUMNA IZQUIERDA: Descripción, Media y Specs */}
          <div className="lg:col-span-2 space-y-12">
            {/* SINOPSIS CON READ MORE */}
            <Synopsis content={cleanDescription} />

            {/* TRAILER */}
            {mainTrailer && (
              <section>
                <h4 className="font-marker text-2xl text-white mb-4 flex items-center gap-2">
                  <Play className="text-zaun-green" /> TRÁILER OFICIAL
                </h4>
                <div className="w-full aspect-video border-2 border-gray-800 shadow-[8px_8px_0_#000] bg-black">
                  <video
                    src={mainTrailer}
                    controls
                    className="w-full h-full object-contain"
                    poster={game.background_image}
                  ></video>
                </div>
              </section>
            )}

            {/* CARRUSEL DE IMÁGENES */}
            <ScreenshotsCarousel screenshots={game.extraScreenshots} />

            {/* REQUISITOS DEL SISTEMA (PC) */}
            {pcRequirements &&
              (pcRequirements.minimum || pcRequirements.recommended) && (
                <section className="bg-gray-900 border-2 border-gray-800 p-6 md:p-8 shadow-[8px_8px_0_#000]">
                  <h4 className="font-marker text-2xl text-white mb-6 border-b-2 border-gray-800 pb-2 flex items-center gap-2">
                    <Cpu className="text-jinx-pink" /> REQUISITOS DEL SISTEMA
                    (PC)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm font-mono text-gray-400">
                    {pcRequirements.minimum && (
                      <div>
                        <h5 className="text-zaun-green font-bold mb-2">
                          MÍNIMOS:
                        </h5>
                        <div className="whitespace-pre-wrap leading-relaxed">
                          {pcRequirements.minimum
                            .replace("Minimum:", "")
                            .trim()}
                        </div>
                      </div>
                    )}
                    {pcRequirements.recommended && (
                      <div>
                        <h5 className="text-jinx-pink font-bold mb-2">
                          RECOMENDADOS:
                        </h5>
                        <div className="whitespace-pre-wrap leading-relaxed">
                          {pcRequirements.recommended
                            .replace("Recommended:", "")
                            .trim()}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}
          </div>

          {/* COLUMNA DERECHA: Metadatos y Tiendas */}
          <div className="space-y-6">
            {/* INFO */}
            <div className="bg-gray-900 p-6 border-2 border-gray-800 shadow-[6px_6px_0_#000]">
              <h4 className="font-marker text-xl text-white border-b-2 border-gray-800 pb-2 mb-4">
                INFO TÉCNICA
              </h4>
              <ul className="space-y-4 font-mono text-sm">
                <li className="flex justify-between items-center border-b border-gray-800 pb-2">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Calendar size={16} /> LANZAMIENTO
                  </span>
                  <span className="text-white font-bold">
                    {game.released
                      ? new Date(game.released).toLocaleDateString()
                      : "TBA"}
                  </span>
                </li>
                <li className="flex justify-between flex-wrap gap-2 border-b border-gray-800 pb-2">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Users size={16} /> DESARROLLADOR
                  </span>
                  <span className="text-zaun-green font-bold text-right wrap-break-word max-w-37.5">
                    {game.developers?.map((d) => d.name).join(", ") || "N/A"}
                  </span>
                </li>
              </ul>
            </div>

            {/* PLATAFORMAS CON ICONOS */}
            <div className="bg-gray-900 p-6 border-2 border-gray-800 shadow-[6px_6px_0_#000]">
              <h4 className="font-marker text-xl text-white border-b-2 border-gray-800 pb-2 mb-4 flex items-center gap-2">
                <Monitor size={20} className="text-jinx-pink" /> PLATAFORMAS
              </h4>
              <div className="flex flex-wrap gap-2">
                {game.platforms?.map((p) => (
                  <span
                    key={p.platform.id}
                    className="text-gray-300 text-sm flex items-center gap-2 bg-black px-3 py-2 border border-gray-800"
                  >
                    {getPlatformIcon(p.platform.slug)} {p.platform.name}
                  </span>
                ))}
              </div>
            </div>

            {/* TIENDAS / DONDE COMPRAR */}
            {game.stores && game.stores.length > 0 && (
              <div className="bg-gray-900 p-6 border-2 border-gray-800 shadow-[6px_6px_0_#000]">
                <h4 className="font-marker text-xl text-white border-b-2 border-gray-800 pb-2 mb-4 flex items-center gap-2">
                  <ShoppingCart size={20} className="text-zaun-green" /> DÓNDE
                  COMPRAR
                </h4>
                <div className="flex flex-col gap-3">
                  {game.stores.map((s) => (
                    <a
                      key={s.store.id}
                      href={`https://${s.store.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-3 bg-black border border-gray-700 hover:border-zaun-green text-gray-300 hover:text-white transition-colors group"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-xl group-hover:text-zaun-green transition-colors">
                          {getStoreIcon(s.store.slug)}
                        </span>
                        <span className="font-bold">{s.store.name}</span>
                      </span>
                      <ArrowLeft className="rotate-135 opacity-0 group-hover:opacity-100 transition-opacity w-4 h-4 text-zaun-green" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GameDetails;

import { useEffect, useRef, Fragment } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight, Cpu, Joystick } from "lucide-react";
import {
  FaPlaystation,
  FaXbox,
  FaWindows,
  FaApple,
  FaLinux,
  FaAndroid,
  FaGlobe,
} from "react-icons/fa";
import {
  SiNintendoswitch,
  SiIos,
  SiSega,
  SiAtari,
  SiCommodore,
} from "react-icons/si";
import clsx from "clsx";

// ASSETS IMPORTS
import BrushPink from "../../src/assets/images/brush_royal_pink.png";
import PinkPaint from "../../src/assets/images/pink_paint.png";
import XGreen from "../../src/assets/images/X_green.png";

const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

// --- FONDO MURAL ---
const PlatformsBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-gray-950 transform-gpu">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black opacity-90" />
    <img
      src={PinkPaint}
      alt=""
      loading="lazy"
      className="absolute top-10 left-[10%] w-[40%] h-[40%] object-cover opacity-[0.03] rotate-12"
    />
    <img
      src={BrushPink}
      alt=""
      loading="lazy"
      className="absolute bottom-10 right-[-5%] w-[50%] opacity-[0.04] -rotate-12"
    />
    {/* 🚀 AJUSTE: X Verde agregada al mural para equilibrar el caos */}
    <img
      src={XGreen}
      alt=""
      loading="lazy"
      className="absolute top-[30%] right-[15%] w-48 opacity-[0.03] rotate-45"
    />
    <img
      src={XGreen}
      alt=""
      loading="lazy"
      className="absolute bottom-[20%] left-[5%] w-32 opacity-[0.02] -rotate-12"
    />
  </div>
);

// 🚀 HELPER AMPLIADO Y ICONOS MÁS GRANDES
const getGiantPlatformIcon = (slug) => {
  const s = slug.toLowerCase();
  // 🚀 AJUSTE: Añadido group-hover:-rotate-6 para la inclinación y un poco menos de opacidad base
  const baseClasses =
    "w-36 h-36 md:w-40 md:h-40 transition-all duration-500 text-gray-700/50 group-hover:scale-110 group-hover:-rotate-6";

  if (
    s.includes("playstation") ||
    s.includes("ps-") ||
    s.includes("psp") ||
    s.includes("vita")
  )
    return (
      <FaPlaystation
        className={clsx(
          baseClasses,
          "group-hover:text-[#00439C] group-hover:drop-shadow-[0_0_25px_rgba(0,67,156,0.8)]",
        )}
      />
    );

  if (s.includes("xbox"))
    return (
      <FaXbox
        className={clsx(
          baseClasses,
          "group-hover:text-[#107C10] group-hover:drop-shadow-[0_0_25px_rgba(16,124,16,0.8)]",
        )}
      />
    );

  if (s.includes("pc") || s.includes("windows"))
    return (
      <FaWindows
        className={clsx(
          baseClasses,
          "group-hover:text-[#0078D7] group-hover:drop-shadow-[0_0_25px_rgba(0,120,215,0.8)]",
        )}
      />
    );

  if (s.includes("mac") || s.includes("apple"))
    return (
      <FaApple
        className={clsx(
          baseClasses,
          "group-hover:text-gray-200 group-hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]",
        )}
      />
    );

  if (s.includes("linux"))
    return (
      <FaLinux
        className={clsx(
          baseClasses,
          "group-hover:text-yellow-400 group-hover:drop-shadow-[0_0_25px_rgba(250,204,21,0.8)]",
        )}
      />
    );

  if (
    s.includes("nintendo") ||
    s.includes("wii") ||
    s.includes("gamecube") ||
    s.includes("game-boy") ||
    s.includes("snes") ||
    s.includes("nes") ||
    s.includes("ds")
  )
    return (
      <SiNintendoswitch
        className={clsx(
          baseClasses,
          "group-hover:text-[#E60012] group-hover:drop-shadow-[0_0_25px_rgba(230,0,18,0.8)]",
        )}
      />
    );

  if (s.includes("android"))
    return (
      <FaAndroid
        className={clsx(
          baseClasses,
          "group-hover:text-[#3DDC84] group-hover:drop-shadow-[0_0_25px_rgba(61,220,132,0.8)]",
        )}
      />
    );

  if (s.includes("ios"))
    return (
      <SiIos
        className={clsx(
          baseClasses,
          "group-hover:text-gray-200 group-hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]",
        )}
      />
    );

  if (
    s.includes("sega") ||
    s.includes("genesis") ||
    s.includes("dreamcast") ||
    s.includes("game-gear")
  )
    return (
      <SiSega
        className={clsx(
          baseClasses,
          "group-hover:text-[#0089CF] group-hover:drop-shadow-[0_0_25px_rgba(0,137,207,0.8)]",
        )}
      />
    );

  if (s.includes("atari"))
    return (
      <SiAtari
        className={clsx(
          baseClasses,
          "group-hover:text-red-500 group-hover:drop-shadow-[0_0_25px_rgba(239,68,68,0.8)]",
        )}
      />
    );

  if (s.includes("commodore") || s.includes("amiga"))
    return (
      <SiCommodore
        className={clsx(
          baseClasses,
          "group-hover:text-blue-300 group-hover:drop-shadow-[0_0_25px_rgba(147,197,253,0.8)]",
        )}
      />
    );

  if (s.includes("web"))
    return (
      <FaGlobe
        className={clsx(
          baseClasses,
          "group-hover:text-blue-400 group-hover:drop-shadow-[0_0_25px_rgba(96,165,250,0.8)]",
        )}
      />
    );

  return (
    <Joystick
      className={clsx(
        baseClasses,
        "group-hover:text-jinx-pink group-hover:drop-shadow-[0_0_25px_rgba(255,0,255,0.8)]",
      )}
    />
  );
};

// --- COMPONENTE: TARJETA DE PLATAFORMA ---
const PlatformCard = ({ platform }) => {
  return (
    <Link
      to={`/search?platforms=${platform.id}`}
      className="group relative h-72 w-full block overflow-hidden border-2 border-gray-800 bg-gray-950 rounded-xl hover:border-zaun-green transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[8px_8px_0_#0aff60] will-change-[transform,border-color]"
    >
      {/* 1. FONDOS TÉCNICOS */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-gray-800/30 via-gray-950 to-black opacity-80 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      {/* Patrón de puntos o circuito */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[16px_16px] group-hover:opacity-20 transition-opacity pointer-events-none" />

      {/* 🚀 2. LOGO GIGANTE CENTRAL */}
      {/* Centrado, pero sube un poco en hover para no tapar el texto */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 transform group-hover:-translate-y-4 transition-transform duration-500 pb-12">
        {getGiantPlatformIcon(platform.slug)}
      </div>

      {/* 3. BLOQUE DE CONTENIDO (Parte inferior) */}
      <div className="absolute bottom-0 w-full bg-linear-to-t from-black via-gray-950/90 to-transparent pt-12 pb-5 px-6 transition-transform duration-300 z-10">
        {/* Decoración lateral */}
        <div className="absolute left-0 bottom-5 w-1 h-8 bg-gray-800 group-hover:bg-jinx-pink transition-colors duration-300" />

        {/* 🚀 AJUSTE: Texto más chico (text-xl md:text-2xl) para que no sea tan abrumador */}
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

  const fetchPlatformsPage = async ({ pageParam = 1 }) => {
    if (!API_KEY) throw new Error("Falta API Key");
    const res = await fetch(
      `https://api.rawg.io/api/platforms?key=${API_KEY}&ordering=-games_count&page_size=24&page=${pageParam}`,
    );
    if (!res.ok) throw new Error("Error fetching platforms");
    return res.json();
  };

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["allPlatformsHubInfinite"],
    queryFn: fetchPlatformsPage,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.next) {
        return allPages.length + 1;
      }
      return undefined;
    },
    staleTime: Infinity,
  });

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
        {/* HEADER DE LA PÁGINA */}
        <div className="mb-16 md:mb-24 flex flex-col items-center text-center">
          <div className="inline-block mb-4 px-3 py-1 bg-jinx-pink border-2 border-black shadow-[4px_4px_0_#000] -rotate-2">
            <span className="font-bold text-white tracking-widest text-sm flex items-center gap-2 uppercase">
              <Cpu size={16} className="text-white" /> ELIGE TU CAMPO DE BATALLA
            </span>
          </div>

          <div className="relative">
            <img
              src={BrushPink}
              alt=""
              loading="lazy"
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

        {/* GRID DE PLATAFORMAS */}
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

            {/* SENSOR PARA INFINITE SCROLL */}
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

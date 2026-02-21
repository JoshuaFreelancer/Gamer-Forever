import { useEffect, useRef, Fragment } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Gamepad2 } from "lucide-react";

// ASSETS IMPORTS (Ajusta las rutas a tu estructura)
import BrushPink from "../../src/assets/images/brush_royal_pink.png";
import SplayPink from "../../src/assets/images/splay_pink.png";
import PinkPaint from "../../src/assets/images/pink_paint.png";
import XGreen from "../../src/assets/images/X_green.png";

const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

// 🚀 DICCIONARIO DE TRADUCCIÓN (Costo de CPU: 0)
const GENRE_TRANSLATIONS = {
  "Action": "Acción",
  "Indie": "Indie",
  "Adventure": "Aventura",
  "RPG": "Rol (RPG)",
  "Strategy": "Estrategia",
  "Shooter": "Shooter",
  "Casual": "Casual",
  "Simulation": "Simulación",
  "Puzzle": "Puzle",
  "Arcade": "Arcade",
  "Platformer": "Plataformas",
  "Racing": "Carreras",
  "Massively Multiplayer": "Multijugador Masivo",
  "Sports": "Deportes",
  "Fighting": "Peleas",
  "Family": "Familiar",
  "Board Games": "Juegos de Mesa",
  "Educational": "Educativo",
  "Card": "Juegos de Cartas"
};

// --- FONDO MURAL OPTIMIZADO PARA CATEGORÍAS ---
const CategoriesBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-gray-950 transform-gpu">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black opacity-90" />
    <img
      src={PinkPaint}
      alt=""
      loading="lazy"
      className="absolute top-20 right-[10%] w-[50%] h-[50%] object-cover opacity-[0.03] -rotate-12"
    />
    <img
      src={SplayPink}
      alt=""
      loading="lazy"
      className="absolute bottom-20 left-[-10%] w-[60%] opacity-[0.04] rotate-12"
    />
  </div>
);

// --- HELPER IMÁGENES ---
const getCroppedImageUrl = (url) => {
  if (!url) return "";
  const target = "media/";
  const index = url.indexOf(target) + target.length;
  return url.slice(0, index) + "crop/600/400/" + url.slice(index);
};

// --- COMPONENTE: TARJETA DE CATEGORÍA ---
const CategoryCard = ({ genre }) => {
  // Traducimos el nombre, si no existe en el diccionario, dejamos el original
  const translatedName = GENRE_TRANSLATIONS[genre.name] || genre.name;

  return (
    <Link
      to={`/search?genres=${genre.id}`}
      className="group relative h-64 md:h-80 w-full block overflow-hidden border-2 border-gray-800 rounded-lg hover:border-zaun-green transition-[transform,border-color,box-shadow] duration-300 transform hover:-translate-y-2 hover:shadow-[8px_8px_0_#000] will-change-[transform,border-color]"
    >
      <div className="absolute inset-0 bg-black">
        <img
          src={getCroppedImageUrl(genre.image_background)}
          alt={genre.name}
          loading="lazy"
          className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-80 group-hover:scale-110 transition-[transform,filter,opacity] duration-500 will-change-[transform,filter]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-gray-950 via-gray-950/60 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-300 pointer-events-none will-change-opacity" />
      </div>

      <div className="absolute inset-0 flex flex-col justify-end p-6 transition-transform duration-300">
        <img
          src={XGreen}
          alt=""
          loading="lazy"
          className="absolute top-4 right-4 w-12 opacity-0 group-hover:opacity-80 rotate-12 transition-opacity duration-300 pointer-events-none"
        />

        <div className="flex items-center gap-2 mb-1 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-[transform,opacity] duration-300 delay-75 pointer-events-none">
          <Sparkles size={14} className="text-zaun-green" />
          <span className="text-zaun-green text-xs font-bold tracking-widest uppercase">
            EXPLORAR GÉNERO
          </span>
        </div>

        {/* 🚀 Ajuste: Texto más pequeño, sin saltos raros */}
        <h3 
          className="font-marker text-2xl md:text-3xl text-white group-hover:text-jinx-pink transition-colors duration-300 drop-shadow-[4px_4px_0_#000] relative z-10 leading-tight"
        >
          {translatedName.toUpperCase()}
        </h3>

        <div className="w-full h-1.5 bg-gray-800 mt-4 rounded-full overflow-hidden pointer-events-none">
          <div className="h-full bg-jinx-pink w-0 group-hover:w-full transition-[width] duration-500 ease-out will-change-[width]" />
        </div>

        <div className="flex items-center justify-between mt-3 pointer-events-none">
           <p className="text-gray-400 text-sm font-mono font-bold">
             {genre.games_count.toLocaleString()} JUEGOS
           </p>
           <ArrowRight size={20} className="text-gray-600 group-hover:text-white transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
        </div>
      </div>
    </Link>
  );
};


// --- COMPONENTE PRINCIPAL ---
const Categories = () => {
  const loadMoreRef = useRef(null);

  const fetchGenresPage = async ({ pageParam = 1 }) => {
    if (!API_KEY) throw new Error("Falta API Key");
    const res = await fetch(
      `https://api.rawg.io/api/genres?key=${API_KEY}&ordering=-games_count&page_size=12&page=${pageParam}`
    );
    if (!res.ok) throw new Error("Error fetching genres");
    return res.json();
  };

  const { 
    data, 
    isLoading, 
    isError, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useInfiniteQuery({
    queryKey: ["allGenresHubInfinite"],
    queryFn: fetchGenresPage,
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
      { threshold: 0.1 }
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
      <CategoriesBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER DE LA PÁGINA */}
        <div className="mb-16 md:mb-24 flex flex-col items-center text-center">
          <div className="inline-block mb-4 px-3 py-1 bg-jinx-pink border-2 border-black shadow-[4px_4px_0_#000] -rotate-2">
            <span className="font-bold text-white tracking-widest text-sm flex items-center gap-2">
              <Gamepad2 size={16} className="text-white" /> ENCUENTRA TU VICIO
            </span>
          </div>
          
          <div className="relative">
            <img
              src={BrushPink}
              alt=""
              loading="lazy"
              className="absolute -top-12 -left-12 w-[140%] h-[160%] object-contain opacity-40 -rotate-2 pointer-events-none"
            />
            <h1 className="font-marker text-5xl md:text-8xl relative z-10 text-white drop-shadow-[6px_6px_0_#000] leading-none">
              DIRECTORIO DE <br />
              <span className="text-zaun-green text-stroke-black">GÉNEROS</span>
            </h1>
          </div>
          <p className="mt-6 text-gray-400 font-roboto text-lg md:text-xl max-w-2xl mx-auto">
            Desde la acción más frenética hasta los RPGs más densos. Selecciona un género y descubre tu próxima obsesión.
          </p>
        </div>

        {/* GRID DE GÉNEROS */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="h-64 md:h-80 bg-gray-900 rounded-lg animate-pulse border-2 border-gray-800"
              ></div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 border-4 border-red-600 bg-gray-900 shadow-[8px_8px_0_#dc2626] text-center max-w-lg mx-auto">
            <span className="text-red-500 font-marker text-3xl mb-2 block">
              ERROR DE SISTEMA
            </span>
            <p className="text-gray-300 font-mono">
              No pudimos cargar los géneros. Revisa tu conexión.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.pages.map((page, index) => (
                <Fragment key={index}>
                  {page.results.map((genre) => (
                    <CategoryCard key={genre.id} genre={genre} />
                  ))}
                </Fragment>
              ))}
            </div>

            {/* 🚀 SENSOR PARA INFINITE SCROLL MEJORADO (Sin saltos visuales) */}
            <div 
              ref={loadMoreRef} 
              className="w-full h-16 mt-8 flex items-center justify-center"
            >
              {isFetchingNextPage && (
                <span className="font-marker text-xl md:text-2xl tracking-widest text-jinx-pink animate-pulse">
                  CARGANDO MÁS GÉNEROS...
                </span>
              )}
            </div>
          </>
        )}

      </div>
    </section>
  );
};

export default Categories;
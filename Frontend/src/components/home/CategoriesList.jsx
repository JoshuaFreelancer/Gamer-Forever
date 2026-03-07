import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { getCroppedImageUrl } from "../../utils/imageCrop";
import { GENRE_TRANSLATIONS } from "../../utils/translations";
import API from "../../services/api";

import BrushPink from "../../assets/images/brush_royal_pink.webp";

// --- COMPONENTE: TARJETA DE CATEGORÍA ---
const CategoryCard = ({ genre }) => {
  const translatedName = GENRE_TRANSLATIONS[genre.name] || genre.name;

  return (
    <Link
      to={`/search?genres=${genre.id}`}
      className="group relative h-40 md:h-80 w-full block overflow-hidden border-2 border-gray-800 rounded-lg md:hover:border-zaun-green transition-[transform,border-color] duration-300 transform md:-skew-x-6 md:hover:skew-x-0 active:scale-95 md:hover:scale-105 md:hover:z-10 shadow-[2px_2px_0_#000] md:shadow-[4px_4px_0_#000] will-change-transform"
    >
      <div className="absolute inset-0 bg-black">
        <img
          src={getCroppedImageUrl(genre.image_background)}
          alt={genre.name}
          width="600"
          height="400"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover grayscale-0 opacity-100 md:grayscale md:opacity-60 md:group-hover:grayscale-0 md:group-hover:opacity-100 md:group-hover:scale-110 transition-[transform,filter,opacity] duration-500 will-change-[transform,filter]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent opacity-100 md:opacity-90 md:group-hover:opacity-60 transition-opacity duration-300 pointer-events-none will-change-opacity" />
      </div>

      <div className="absolute inset-0 flex flex-col justify-end p-3 md:p-6 md:skew-x-6 md:group-hover:skew-x-0 transition-transform duration-300 will-change-transform">
        <h3
          className="font-marker text-base sm:text-lg md:text-2xl text-white md:group-hover:text-jinx-pink transition-colors duration-300 drop-shadow-md relative z-10 leading-tight wrap-break-word hyphens-auto"
          lang="es"
        >
          {translatedName.toUpperCase()}
        </h3>

        <div className="w-full h-1 bg-gray-700 mt-1 md:mt-2 rounded-full overflow-hidden md:group-hover:bg-gray-600 transition-colors pointer-events-none hidden md:block">
          <div className="h-full bg-zaun-green w-0 md:group-hover:w-full transition-all duration-500 ease-out" />
        </div>

        <p className="text-gray-300 md:text-gray-400 text-[10px] md:text-xs mt-1 md:mt-2 font-mono pointer-events-none">
          {genre.games_count.toLocaleString()} TÍTULOS
        </p>
      </div>
    </Link>
  );
};

// --- COMPONENTE PRINCIPAL ---
const CategoriesList = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["genresListHome"],
    queryFn: () =>
      API.getCollection("genres", { ordering: "-games_count", page_size: 6 }),
    staleTime: Infinity,
  });

  const genres = data?.results || [];

  return (
    <section className="relative w-full py-12 md:py-24 px-4 md:px-8 bg-gray-950 border-t border-gray-900 overflow-hidden">
      {/* HEADER SECCIÓN */}
      <div className="max-w-7xl mx-auto mb-8 md:mb-16 flex flex-col md:flex-row items-center md:items-end justify-between gap-4 md:gap-6 relative z-10 text-center md:text-left">
        <div className="relative">
          <img
            src={BrushPink}
            alt=""
            width="400"
            height="150"
            loading="lazy"
            decoding="async"
            className="absolute -top-4 -left-6 md:-top-6 md:-left-10 w-[130%] md:w-[140%] h-[150%] md:h-[160%] object-contain opacity-80 -rotate-1 z-0 pointer-events-none"
          />
          <h2 className="relative z-10 font-marker text-4xl sm:text-5xl md:text-6xl text-white drop-shadow-[2px_2px_0_#000] md:drop-shadow-[4px_4px_0_#000]">
            CATEGORÍAS <br className="sm:hidden" />
            <span className="text-zaun-green text-stroke-black ml-1 md:ml-0">
              POPULARES
            </span>
          </h2>
        </div>

        <Link
          to="/categories"
          // 🚀 SOLUCIÓN: transform-gpu aísla este elemento. transition-colors duration-300 suaviza el cambio.
          className="group flex items-center justify-center gap-1 md:gap-2 text-gray-400 hover:text-white transition-colors duration-300 font-bold tracking-widest text-[11px] md:text-sm border-b-2 border-transparent hover:border-jinx-pink pb-1 mt-2 md:mt-0 transform-gpu"
        >
          VER TODAS LAS CATEGORÍAS
          {/* 🚀 SOLUCIÓN: Añadimos duration-300 explícito para que el movimiento coincida con el cambio de color */}
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300 text-jinx-pink transform-gpu" />
        </Link>
      </div>

      {/* GRID DE CATEGORÍAS */}
      <div className="max-w-7xl mx-auto relative z-10">
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-40 md:h-80 bg-gray-900 rounded-lg animate-pulse border border-gray-800 transform md:-skew-x-6"
              ></div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-red-500 font-mono text-center p-8 bg-gray-900 border-2 border-red-500">
            Error al cargar categorías.
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
            {genres.map((genre) => (
              <CategoryCard key={genre.id} genre={genre} />
            ))}
          </div>
        )}
      </div>

      {/* TEXTURA DE FONDO SUTIL */}
      {/* 🚀 SOLUCIÓN: transform-gpu obliga a la tarjeta gráfica a pintar este pesado gradiente una sola vez como textura estática, en lugar de repintarlo con cada hover de la página. */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[repeating-linear-gradient(-45deg,#fff_0,#fff_1px,transparent_1px,transparent_20px)] transform-gpu" />
    </section>
  );
};

export default CategoriesList;

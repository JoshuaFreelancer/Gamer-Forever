import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// 🚀 IMPORTACIONES CENTRALIZADAS
import { getCroppedImageUrl } from "../../utils/imageCrop";
import { GENRE_TRANSLATIONS } from "../../utils/translations";
import API from "../../services/api"; // 🚀 Importamos nuestra API unificada

// ASSETS
import BrushPink from "../../assets/images/brush_royal_pink.webp";
import XGreen from "../../assets/images/X_green.webp";

// --- COMPONENTE: TARJETA DE CATEGORÍA ---
const CategoryCard = ({ genre }) => {
  const translatedName = GENRE_TRANSLATIONS[genre.name] || genre.name;

  return (
    <Link
      to={`/search?genres=${genre.id}`}
      className="group relative h-80 w-full block overflow-hidden border-2 border-gray-800 rounded-lg hover:border-zaun-green transition-[transform,border-color] duration-300 transform md:-skew-x-6 hover:skew-x-0 hover:scale-105 hover:z-10 shadow-[4px_4px_0_#000] will-change-transform"
    >
      {/* 1. IMAGEN DE FONDO */}
      <div className="absolute inset-0 bg-black">
        {/* 🚀 OPTIMIZACIÓN: Añadimos dimensiones exactas del recorte (600x400) para evitar CLS */}
        <img
          src={getCroppedImageUrl(genre.image_background)}
          alt={genre.name}
          width="600"
          height="400"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-[transform,filter,opacity] duration-500 will-change-[transform,filter]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none will-change-opacity" />
      </div>

      {/* 2. CONTENIDO TEXTO */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:skew-x-6 group-hover:skew-x-0 transition-transform duration-300 will-change-transform">
        {/* 🚀 OPTIMIZACIÓN: Añadimos dimensiones para el elemento decorativo (w-12 de Tailwind = 48px) */}
        <img
          src={XGreen}
          alt=""
          width="48"
          height="48"
          loading="lazy"
          decoding="async"
          className="absolute top-4 right-4 w-12 opacity-0 group-hover:opacity-100 rotate-12 transition-opacity duration-300 pointer-events-none"
        />

        <div className="flex items-center gap-2 mb-1 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-[transform,opacity] duration-300 delay-75 pointer-events-none">
          <Sparkles size={14} className="text-zaun-green" />
          <span className="text-zaun-green text-xs font-bold tracking-widest uppercase">
            Explorar
          </span>
        </div>

        <h3
          className="font-marker text-2xl text-white group-hover:text-jinx-pink transition-colors duration-300 drop-shadow-md relative z-10 leading-tight wrap-break-word hyphens-auto"
          lang="es"
        >
          {translatedName.toUpperCase()}
        </h3>

        <div className="w-full h-1 bg-gray-700 mt-2 rounded-full overflow-hidden group-hover:bg-gray-600 transition-colors pointer-events-none">
          <div className="h-full bg-zaun-green w-0 group-hover:w-full transition-all duration-500 ease-out" />
        </div>

        <p className="text-gray-400 text-xs mt-2 font-mono pointer-events-none">
          {genre.games_count.toLocaleString()} TÍTULOS
        </p>
      </div>
    </Link>
  );
};

// --- COMPONENTE PRINCIPAL ---
const CategoriesList = () => {
  // 🚀 REEMPLAZO: Usamos useQuery apuntando a nuestra API y pidiendo solo 6 resultados
  const { data, isLoading, isError } = useQuery({
    queryKey: ["genresListHome"],
    queryFn: () =>
      API.getCollection("genres", { ordering: "-games_count", page_size: 6 }),
    staleTime: Infinity,
  });

  const genres = data?.results || [];

  return (
    <section className="relative w-full py-24 px-4 md:px-8 bg-gray-950 border-t border-gray-900 overflow-hidden">
      {/* HEADER SECCIÓN */}
      <div className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row items-end justify-between gap-6 relative z-10">
        <div className="relative">
          {/* 🚀 OPTIMIZACIÓN: Añadimos dimensiones proporcionales a la brocha decorativa */}
          <img
            src={BrushPink}
            alt=""
            width="400"
            height="150"
            loading="lazy"
            decoding="async"
            className="absolute -top-6 -left-10 w-[140%] h-[160%] object-contain opacity-80 -rotate-1 z-0 pointer-events-none"
          />
          <h2 className="relative z-10 font-marker text-5xl md:text-6xl text-white drop-shadow-[4px_4px_0_#000]">
            CATEGORÍAS{" "}
            <span className="text-zaun-green text-stroke-black">POPULARES</span>
          </h2>
        </div>

        <Link
          to="/categories"
          className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-bold tracking-widest text-sm border-b-2 border-transparent hover:border-jinx-pink pb-1"
        >
          VER TODAS LAS CATEGORÍAS
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform text-jinx-pink will-change-transform"
          />
        </Link>
      </div>

      {/* GRID DE CATEGORÍAS */}
      <div className="max-w-7xl mx-auto relative z-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-80 bg-gray-900 rounded-lg animate-pulse border border-gray-800 transform md:-skew-x-6"
              ></div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-red-500 font-mono text-center p-8 bg-gray-900 border-2 border-red-500">
            Error al cargar categorías.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 md:gap-4">
            {genres.map((genre) => (
              <CategoryCard key={genre.id} genre={genre} />
            ))}
          </div>
        )}
      </div>

      {/* TEXTURA DE FONDO SUTIL */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[repeating-linear-gradient(-45deg,#fff_0,#fff_1px,transparent_1px,transparent_20px)]" />
    </section>
  );
};

export default CategoriesList;

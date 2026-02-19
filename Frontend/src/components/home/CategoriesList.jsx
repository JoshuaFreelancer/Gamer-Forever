import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom"; 
import { ArrowRight, Sparkles } from "lucide-react";

// ASSETS
import BrushPink from "../../assets/images/brush_royal_pink.png";
import XGreen from "../../assets/images/X_green.png";

// SEGURIDAD
const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

// --- HELPER: CROPPED IMAGES ---
const getCroppedImageUrl = (url) => {
  if (!url) return "";
  const target = "media/";
  const index = url.indexOf(target) + target.length;
  return url.slice(0, index) + "crop/600/400/" + url.slice(index);
};

// --- COMPONENTE: TARJETA DE CATEGORÍA ---
const CategoryCard = ({ genre, index }) => {
  return (
    <Link
      to={`/category/${genre.slug}`}
      // 🚀 OPTIMIZACIÓN: transition específica y will-change-transform
      className="group relative h-80 w-full block overflow-hidden border-2 border-gray-800 rounded-lg hover:border-zaun-green transition-[transform,border-color] duration-300 transform md:-skew-x-6 hover:skew-x-0 hover:scale-105 hover:z-10 shadow-[4px_4px_0_#000] will-change-transform"
    >
      {/* 1. IMAGEN DE FONDO */}
      <div className="absolute inset-0 bg-black">
        <img
          src={getCroppedImageUrl(genre.image_background)}
          alt={genre.name}
          loading="lazy"
          // 🚀 OPTIMIZACIÓN: Transiciones separadas y aceleración por hardware para el filtro
          className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-[transform,filter,opacity] duration-500 will-change-[transform,filter]"
        />
        {/* Overlay degradado */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none will-change-opacity" />
      </div>

      {/* 2. CONTENIDO TEXTO */}
      {/* 🚀 OPTIMIZACIÓN: transition-transform exclusiva */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:skew-x-6 group-hover:skew-x-0 transition-transform duration-300 will-change-transform">
        
        {/* Decoración X Verde */}
        <img
          src={XGreen}
          alt=""
          loading="lazy"
          className="absolute top-4 right-4 w-12 opacity-0 group-hover:opacity-100 rotate-12 transition-opacity duration-300 pointer-events-none"
        />

        <div className="flex items-center gap-2 mb-1 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-[transform,opacity] duration-300 delay-75 pointer-events-none">
          <Sparkles size={14} className="text-zaun-green" />
          <span className="text-zaun-green text-xs font-bold tracking-widest uppercase">
            Explorar
          </span>
        </div>

        <h3 className="font-marker text-3xl text-white group-hover:text-jinx-pink transition-colors duration-300 drop-shadow-md relative z-10">
          {genre.name}
        </h3>

        <div className="w-full h-1 bg-gray-700 mt-2 rounded-full overflow-hidden group-hover:bg-gray-600 transition-colors pointer-events-none">
          {/* 🚀 OPTIMIZACIÓN: Usar scale-x en lugar de width (w-full) es más rápido, pero con width y ease-out aquí basta si no hay lag extra */}
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
  const fetchGenres = async () => {
    if (!API_KEY) throw new Error("Falta API Key");
    const res = await fetch(
      `https://api.rawg.io/api/genres?key=${API_KEY}&ordering=-games_count&page_size=6`,
    );
    if (!res.ok) throw new Error("Error fetching genres");
    return res.json();
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["genresList"],
    queryFn: fetchGenres,
    staleTime: Infinity, // Excelente decisión de mantener el Infinity aquí
  });

  const genres = data?.results || [];

  return (
    <section className="relative w-full py-24 px-4 md:px-8 bg-gray-950 border-t border-gray-900 overflow-hidden">
      {/* HEADER SECCIÓN */}
      <div className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row items-end justify-between gap-6 relative z-10">
        <div className="relative">
          <img
            src={BrushPink}
            alt=""
            loading="lazy"
            className="absolute -top-6 -left-10 w-[140%] h-[160%] object-contain opacity-80 -rotate-1 z-0 pointer-events-none"
          />
          <h2 className="relative z-10 font-marker text-5xl md:text-6xl text-white drop-shadow-[4px_4px_0_#000]">
            CATEGORÍAS{" "}
            <span className="text-zaun-green text-stroke-white">POPULARES</span>
          </h2>
        </div>

        <Link
          to="/genres"
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
          <div className="text-red-500 font-mono text-center">
            Error al cargar categorías.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 md:gap-4">
            {genres.map((genre, index) => (
              <CategoryCard key={genre.id} genre={genre} index={index} />
            ))}
          </div>
        )}
      </div>

      {/* TEXTURA DE FONDO SUTIL - OPTIMIZADA */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[repeating-linear-gradient(-45deg,#fff_0,#fff_1px,transparent_1px,transparent_20px)]" />
    </section>
  );
};

export default CategoriesList;
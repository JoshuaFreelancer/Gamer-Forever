import { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Gamepad2, Search, X } from "lucide-react";

// 🚀 TUS HELPERS CENTRALIZADOS Y HOOKS
import { getCroppedImageUrl } from "../utils/imageCrop";
import { GENRE_TRANSLATIONS } from "../utils/translations";
import { useInfiniteCollection } from "../hooks/useInfiniteCollection";

// ASSETS IMPORTS
import BrushPink from "../assets/images/brush_royal_pink.webp";
import SplayPink from "../assets/images/splay_pink.webp";
import PinkPaint from "../assets/images/pink_paint.webp";
import XGreen from "../assets/images/X_green.webp";

// --- FONDO MURAL OPTIMIZADO PARA CATEGORÍAS ---
const CategoriesBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-gray-950 transform-gpu">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black opacity-90" />
    <img
      src={PinkPaint}
      alt=""
      width="800"
      height="800"
      loading="lazy"
      decoding="async"
      className="absolute top-20 right-[10%] w-[50%] h-[50%] object-cover opacity-[0.03] -rotate-12"
    />
    <img
      src={SplayPink}
      alt=""
      width="800"
      height="800"
      loading="lazy"
      decoding="async"
      className="absolute bottom-20 left-[-10%] w-[60%] opacity-[0.04] rotate-12"
    />
  </div>
);

// --- COMPONENTE: TARJETA DE CATEGORÍA ---
const CategoryCard = ({ genre }) => {
  const translatedName = GENRE_TRANSLATIONS[genre.name] || genre.name;

  return (
    <Link
      to={`/search?genres=${genre.id}`}
      className="group relative h-40 sm:h-56 md:h-80 w-full block overflow-hidden border-2 border-gray-800 rounded-lg md:hover:border-zaun-green transition-[transform,border-color,box-shadow] duration-300 transform md:hover:-translate-y-2 shadow-[2px_2px_0_#000] md:shadow-none md:hover:shadow-[8px_8px_0_#000] active:scale-95 md:active:scale-100 will-change-[transform,border-color]"
    >
      <div className="absolute inset-0 bg-black">
        <img
          src={getCroppedImageUrl(genre.image_background)}
          alt={genre.name}
          width="600"
          height="400"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover grayscale-0 opacity-80 md:opacity-50 md:grayscale md:group-hover:grayscale-0 md:group-hover:opacity-80 md:group-hover:scale-110 transition-[transform,filter,opacity] duration-500 will-change-[transform,filter]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-gray-950 via-gray-950/80 md:via-gray-950/60 to-transparent opacity-100 md:opacity-90 md:group-hover:opacity-70 transition-opacity duration-300 pointer-events-none will-change-opacity" />
      </div>

      <div className="absolute inset-0 flex flex-col justify-end p-3 md:p-6 transition-transform duration-300">
        <img
          src={XGreen}
          alt=""
          width="48"
          height="48"
          loading="lazy"
          decoding="async"
          className="hidden md:block absolute top-4 right-4 w-12 opacity-0 group-hover:opacity-80 rotate-12 transition-opacity duration-300 pointer-events-none"
        />

        <div className="hidden md:flex items-center gap-2 mb-1 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-[transform,opacity] duration-300 delay-75 pointer-events-none">
          <Sparkles size={14} className="text-zaun-green" />
          <span className="text-zaun-green text-xs font-bold tracking-widest uppercase">
            EXPLORAR GÉNERO
          </span>
        </div>

        <h3 className="font-marker text-lg sm:text-2xl md:text-3xl text-white md:group-hover:text-jinx-pink transition-colors duration-300 drop-shadow-[2px_2px_0_#000] md:drop-shadow-[4px_4px_0_#000] relative z-10 leading-tight wrap-break-word">
          {translatedName.toUpperCase()}
        </h3>

        <div className="w-full h-1 md:h-1.5 bg-gray-800 mt-2 md:mt-4 rounded-full overflow-hidden pointer-events-none">
          <div className="h-full bg-jinx-pink w-full md:w-0 md:group-hover:w-full transition-[width] duration-500 ease-out will-change-[width]" />
        </div>

        <div className="flex items-center justify-between mt-2 md:mt-3 pointer-events-none">
          <p className="text-gray-300 md:text-gray-400 text-[10px] sm:text-xs md:text-sm font-mono font-bold whitespace-nowrap">
            {genre.games_count.toLocaleString()} JUEGOS
          </p>
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-white md:text-gray-600 md:group-hover:text-white transform translate-x-0 md:-translate-x-4 md:group-hover:translate-x-0 transition-all duration-300" />
        </div>
      </div>
    </Link>
  );
};

// --- COMPONENTE PRINCIPAL ---
const Categories = () => {
  const loadMoreRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteCollection("genres", "allGenresInfinite", 12);

  // 🚀 LÓGICA DEL FILTRO "WORD STARTS WITH"
  const filteredGenres = useMemo(() => {
    if (!data) return [];

    const allGenres = data.pages.flatMap((page) => page.results);

    if (!searchTerm.trim()) return allGenres;

    const lowerSearch = searchTerm.toLowerCase().trim();

    return allGenres.filter((genre) => {
      const originalName = genre.name.toLowerCase();
      const translatedName = (
        GENRE_TRANSLATIONS[genre.name] || genre.name
      ).toLowerCase();

      // 🚀 Comprueba si ALGUNA palabra en el título EMPIEZA con la búsqueda
      const isMatch = (text) =>
        text.split(" ").some((word) => word.startsWith(lowerSearch));

      return isMatch(originalName) || isMatch(translatedName);
    });
  }, [data, searchTerm]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          !searchTerm
        ) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, searchTerm]);

  return (
    <section className="relative w-full min-h-screen pt-4 md:pt-18 pb-20 px-4 md:px-8 text-white overflow-hidden">
      <CategoriesBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* HEADER DE LA PÁGINA */}
        <div className="mb-8 md:mb-16 flex flex-col items-center text-center">
          <div className="inline-block mb-4 px-2 md:px-3 py-1 bg-jinx-pink border-2 border-black shadow-[4px_4px_0_#000] -rotate-2">
            <span className="font-bold text-white tracking-widest text-[10px] md:text-sm flex items-center gap-1 md:gap-2">
              <Gamepad2 className="text-white w-4 h-4 md:w-5 md:h-5" />{" "}
              ENCUENTRA TU VICIO
            </span>
          </div>

          <div className="relative w-full px-4">
            <img
              src={BrushPink}
              alt=""
              width="400"
              height="150"
              loading="lazy"
              decoding="async"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] md:w-full h-[140%] md:h-[120%] object-contain opacity-40 rotate-2 pointer-events-none"
            />
            <h1 className="font-marker text-4xl sm:text-5xl md:text-8xl relative z-10 text-white drop-shadow-[4px_4px_0_#000] md:drop-shadow-[6px_6px_0_#000] leading-none">
              CATÁLOGO DE <br />
              <span className="text-zaun-green text-stroke-black">GÉNEROS</span>
            </h1>
          </div>
          <p className="mt-4 md:mt-6 text-gray-400 font-roboto text-sm sm:text-base md:text-xl max-w-2xl mx-auto text-balance mb-8">
            Desde la acción más frenética hasta los RPGs más densos. Selecciona
            un género y descubre tu próxima obsesión.
          </p>

          <div className="w-[95%] sm:w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto relative group mt-4 mb-4">
            <div className="absolute inset-0 bg-jinx-pink transform translate-x-1.5 translate-y-1.5 md:translate-x-2 md:translate-y-2 border-2 border-black -z-10 group-focus-within:translate-x-0 group-focus-within:translate-y-0 transition-transform duration-200"></div>

            <div className="relative flex items-center bg-gray-900 border-2 border-gray-600 group-focus-within:border-white transition-colors duration-200">
              <span className="pl-3 md:pl-4 text-white group-focus-within:text-jinx-pink transition-colors duration-300 shrink-0">
                <Search className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
              </span>
              <input
                type="text"
                placeholder="BUSCAR GÉNERO..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-white font-mono font-bold text-sm md:text-base py-3 md:py-4 px-3 outline-none focus:ring-0 placeholder-gray-400 uppercase tracking-wider"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="pr-3 md:pr-4 pl-2 py-2 text-gray-400 hover:text-white transition-colors flex items-center justify-center shrink-0"
                  title="Borrar búsqueda"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* GRID DE GÉNEROS */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="h-40 sm:h-56 md:h-80 bg-gray-900 rounded-lg animate-pulse border-2 border-gray-800"
              ></div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-6 md:p-8 border-4 border-red-600 bg-gray-900 shadow-[8px_8px_0_#dc2626] text-center max-w-lg mx-auto">
            <span className="text-red-500 font-marker text-2xl md:text-3xl mb-2 block">
              ERROR DE SISTEMA
            </span>
            <p className="text-gray-300 font-mono text-sm md:text-base">
              No pudimos cargar los datos. Revisa tu conexión.
            </p>
          </div>
        ) : (
          <>
            {filteredGenres.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 animate-in fade-in duration-300">
                {filteredGenres.map((genre) => (
                  <CategoryCard key={genre.id} genre={genre} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center border-2 border-dashed border-gray-800 bg-gray-900/50">
                <span className="font-marker text-xl md:text-2xl text-gray-500 block mb-2">
                  ZONA VACÍA
                </span>
                <p className="font-mono text-gray-400 text-sm md:text-base">
                  No se encontró ninguna categoría que coincida con{" "}
                  <span className="text-jinx-pink">{searchTerm}</span>.
                </p>
              </div>
            )}

            {!searchTerm && (
              <div
                ref={loadMoreRef}
                className="w-full h-16 mt-8 flex items-center justify-center"
              >
                {isFetchingNextPage && (
                  <span className="font-marker text-lg md:text-2xl tracking-widest text-jinx-pink animate-pulse">
                    CARGANDO MÁS...
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Categories;

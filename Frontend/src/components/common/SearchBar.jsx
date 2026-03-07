import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, X, Loader2, ArrowLeft } from "lucide-react";
import useDebounce from "../../utils/debounce";

import { useSearchStore } from "../../store/useSearchStore";
import { useSearchPreview } from "../../hooks/useSearch";

const SearchBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  const { query, isActive, setQuery, setIsActive, clearSearch } =
    useSearchStore();
  const debouncedQuery = useDebounce(query, 500);

  const { data: searchResults = [], isFetching: loading } =
    useSearchPreview(debouncedQuery);

  const hasNoResults =
    debouncedQuery.trim() !== "" && !loading && searchResults.length === 0;
  const showDropdown = isActive && (searchResults.length > 0 || hasNoResults);

  // 1. Manejo de Clics Fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsActive]);

  // 2. Limpieza al cambiar de ruta
  useEffect(() => {
    setIsActive(false);
    if (!location.pathname.includes("/search")) {
      clearSearch();
    }
  }, [location.pathname, clearSearch, setIsActive]);

  // 🚀 3. BLOQUEO DE SCROLL EN MÓVIL
  useEffect(() => {
    if (isActive && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Limpieza de seguridad si el componente se desmonta
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isActive]);

  // 4. Handlers
  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setIsActive(true);
  };

  const handleSelectGame = (gameId) => {
    navigate(`/game/${gameId}`);
    clearSearch();
    setIsActive(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setIsActive(false);
    }
  };

  const closeMobileSearch = () => {
    setIsActive(false);
    clearSearch();
  };

  return (
    <div
      ref={searchRef}
      className={`w-full max-w-xl z-100 transition-all duration-200 ${
        isActive
          ? "fixed inset-0 bg-gray-950/98 backdrop-blur-xl p-4 flex flex-col md:relative md:inset-auto md:bg-transparent md:p-0 md:block"
          : "relative"
      }`}
    >
      {/* shrink-0 evita que el formulario se aplaste en móvil cuando aparecen los resultados */}
      <div className="flex items-center gap-3 w-full shrink-0">
        {/* --- BOTÓN ATRÁS (SOLO MÓVIL Y ACTIVO) --- */}
        {isActive && (
          <button
            type="button"
            onClick={closeMobileSearch}
            className="md:hidden shrink-0 text-jinx-pink hover:text-white transition-colors p-2 bg-black border-2 border-jinx-pink rounded-sm transform -skew-x-12 active:scale-95 focus:outline-none"
            aria-label="Cerrar búsqueda"
          >
            <ArrowLeft
              size={20}
              strokeWidth={3}
              className="transform skew-x-12"
            />
          </button>
        )}

        {/* --- FORMULARIO PRINCIPAL --- */}
        <form
          onSubmit={handleSubmit}
          className="relative w-full transform -skew-x-12 group flex-1"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="absolute inset-0 bg-black translate-x-1 translate-y-1 md:translate-x-3 md:translate-y-3 rounded-sm transition-transform group-focus-within:translate-x-1.5 group-focus-within:translate-y-1.5 md:group-focus-within:translate-x-4 md:group-focus-within:translate-y-4 will-change-transform"></div>

          <div className="absolute inset-0 bg-jinx-pink translate-x-0.5 translate-y-0.5 md:translate-x-1.5 md:translate-y-1.5 border border-black rounded-sm transition-transform group-focus-within:translate-x-1 group-focus-within:translate-y-1 md:group-focus-within:translate-x-2 md:group-focus-within:translate-y-2 will-change-transform"></div>

          <div
            className={`relative flex items-center bg-[#f0f0f0] border-2 border-black rounded-sm transition-all duration-200 ${isActive ? "h-10 md:h-11" : "h-8 md:h-11"}`}
          >
            <button
              type="submit"
              className="h-full px-2 md:px-4 bg-jinx-pink text-white border-r-2 border-black hover:bg-black hover:text-jinx-pink transition-colors focus:outline-none flex items-center justify-center"
              aria-label="Buscador"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin transform skew-x-12" />
              ) : (
                <Search
                  strokeWidth={3}
                  className="w-4 h-4 md:w-5 md:h-5 transform skew-x-12"
                />
              )}
            </button>

            <input
              type="text"
              className="w-full bg-transparent border-none outline-none focus:ring-0 text-black placeholder-gray-500 font-bold px-2 md:px-4 text-xs md:text-sm transform skew-x-12 uppercase tracking-wide"
              placeholder="Buscar Juegos..."
              value={query}
              onChange={handleInputChange}
              onFocus={() => setIsActive(true)}
              autoFocus={isActive && window.innerWidth < 768}
            />

            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="h-full px-2 md:px-3 text-gray-400 hover:text-red-600 transition-colors focus:outline-none flex items-center justify-center"
              >
                <X
                  strokeWidth={3}
                  className="w-4 h-4 md:w-5 md:h-5 transform skew-x-12"
                />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* --- DROPDOWN DE RESULTADOS --- */}
      {showDropdown && (
        // 🚀 Agregado pb-4 en móvil para que haya un margen debajo y la sombra verde no se corte
        <div className="w-full z-100 mt-4 relative md:absolute md:top-full md:left-0 md:right-0 pb-4 md:pb-0">
          {/* 🚀 Recuperada la sombra 4px_4px para que resalte igual que en PC */}
          <div className="bg-black border-2 border-jinx-pink shadow-[4px_4px_0_#0aff60] transform skew-x-0 md:-skew-x-12 overflow-hidden flex flex-col">
            {searchResults.length > 0 ? (
              <>
                {/* 🚀 max-h-[60vh] en móvil evita que la caja cubra toda la pantalla, adaptándose al contenido */}
                <ul className="overflow-y-auto custom-scrollbar max-h-[60vh] md:max-h-64">
                  {searchResults.map((game) => (
                    <li
                      key={game.id}
                      onClick={() => handleSelectGame(game.id)}
                      className="px-3 py-2 md:px-4 md:py-3 border-b border-gray-800 cursor-pointer hover:bg-zaun-green hover:text-black transition-colors group flex items-center gap-2 md:gap-3"
                    >
                      {game.background_image && (
                        <img
                          src={game.background_image}
                          alt={game.name}
                          width="32"
                          height="32"
                          loading="lazy"
                          decoding="async"
                          className="w-6 h-6 md:w-8 md:h-8 object-cover border border-gray-600 transform skew-x-0 md:skew-x-12 group-hover:border-black shrink-0"
                        />
                      )}
                      <span className="font-bold text-xs md:text-sm transform skew-x-0 md:skew-x-12 truncate w-full group-hover:font-extrabold">
                        {game.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-gray-900 p-2 text-center text-[10px] md:text-xs text-jinx-pink uppercase font-bold cursor-pointer hover:bg-gray-800 border-t-2 border-jinx-pink transform skew-x-0 focus:outline-none shrink-0"
                >
                  <span className="inline-block transform skew-x-0 md:skew-x-12">
                    Ver todos los resultados &rarr;
                  </span>
                </button>
              </>
            ) : (
              <div className="p-4 text-center">
                <span className="block font-bold text-xs md:text-sm text-gray-400 transform skew-x-0 md:skew-x-12">
                  No se encontraron resultados para <br className="md:hidden" />
                  <span className="text-jinx-pink ml-1">
                    &quot;{query}&quot;
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

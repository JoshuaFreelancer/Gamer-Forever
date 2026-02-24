import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, X, Loader2 } from "lucide-react";
import useDebounce from "../../utils/debounce";

// 🚀 IMPORTACIONES DE NUESTRA NUEVA ARQUITECTURA
import { useSearchStore } from "../../store/useSearchStore";
import { useSearchPreview } from "../../hooks/useSearch";

const SearchBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  // 🚀 ZUSTAND: Conectamos el componente al Cerebro Global
  const { query, isActive, setQuery, setIsActive, clearSearch } =
    useSearchStore();

  const debouncedQuery = useDebounce(query, 500);

  // 🚀 REACT QUERY: Magia pura con caché
  const { data: searchResults = [], isFetching: loading } =
    useSearchPreview(debouncedQuery);

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

  // 3. Handlers
  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setIsActive(true);
  };

  const handleSelectGame = (gameId) => {
    navigate(`/game/${gameId}`);
    clearSearch();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setIsActive(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-xl z-50">
      {/* --- FORMULARIO PRINCIPAL --- */}
      <form
        onSubmit={handleSubmit}
        className="relative w-full transform -skew-x-12 group"
        style={{ backfaceVisibility: "hidden" }}
      >
        <div className="absolute inset-0 bg-black translate-x-3 translate-y-3 rounded-sm transition-transform group-focus-within:translate-x-4 group-focus-within:translate-y-4 will-change-transform"></div>
        <div className="absolute inset-0 bg-jinx-pink translate-x-1.5 translate-y-1.5 border border-black rounded-sm transition-transform group-focus-within:translate-x-2 group-focus-within:translate-y-2 will-change-transform"></div>

        <div className="relative flex items-center bg-[#f0f0f0] h-11 border-2 border-black rounded-sm">
          <button
            type="submit"
            className="h-full px-4 bg-jinx-pink text-white border-r-2 border-black hover:bg-black hover:text-jinx-pink transition-colors focus:outline-none"
            aria-label="Buscador"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin transform skew-x-12" />
            ) : (
              <Search
                size={20}
                strokeWidth={3}
                className="transform skew-x-12"
              />
            )}
          </button>

          <input
            type="text"
            className="w-full bg-transparent border-none outline-none focus:ring-0 text-black placeholder-gray-500 font-bold px-4 transform skew-x-12 uppercase tracking-wide"
            placeholder="Buscar juegos..."
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsActive(true)}
          />

          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="h-full px-3 text-gray-400 hover:text-red-600 transition-colors focus:outline-none"
            >
              <X size={20} strokeWidth={3} className="transform skew-x-12" />
            </button>
          )}
        </div>
      </form>

      {/* --- DROPDOWN DE RESULTADOS --- */}
      {isActive && searchResults.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-4 pl-4 pr-2">
          <div className="bg-black border-2 border-jinx-pink shadow-[4px_4px_0_#0aff60] transform -skew-x-12 overflow-hidden">
            <ul className="max-h-64 overflow-y-auto custom-scrollbar">
              {searchResults.map((game) => (
                <li
                  key={game.id}
                  onClick={() => handleSelectGame(game.id)}
                  className="px-4 py-3 border-b border-gray-800 cursor-pointer hover:bg-zaun-green hover:text-black transition-colors group flex items-center gap-3"
                >
                  {game.background_image && (
                    <img
                      src={game.background_image}
                      alt={game.name}
                      width="32"
                      height="32"
                      loading="lazy"
                      decoding="async"
                      className="w-8 h-8 object-cover border border-gray-600 transform skew-x-12 group-hover:border-black"
                    />
                  )}
                  <span className="font-bold text-sm transform skew-x-12 truncate w-full group-hover:font-extrabold">
                    {game.name}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleSubmit}
              className="w-full bg-gray-900 p-2 text-center text-xs text-jinx-pink uppercase font-bold cursor-pointer hover:bg-gray-800 border-t-2 border-jinx-pink transform skew-x-0 focus:outline-none"
            >
              <span className="inline-block transform skew-x-12">
                Ver todos los resultados &rarr;
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, X, Loader2, ArrowLeft } from "lucide-react";
import useDebounce from "../../utils/debounce";

import { useSearchStore } from "../../store/useSearchStore";
import { useSearchPreview } from "../../hooks/useSearch";

const SearchBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  const {
    query: globalQuery,
    isActive,
    setQuery: setGlobalQuery,
    setIsActive,
    clearSearch,
  } = useSearchStore();

  const [localQuery, setLocalQuery] = useState(globalQuery || "");
  const debouncedLocalQuery = useDebounce(localQuery, 500);

  useEffect(() => {
    if (debouncedLocalQuery !== globalQuery) {
      setGlobalQuery(debouncedLocalQuery);
    }
  }, [debouncedLocalQuery, globalQuery, setGlobalQuery]);

  useEffect(() => {
    if (globalQuery === "") {
      setLocalQuery("");
    }
  }, [globalQuery]);

  const { data: searchResults = [], isFetching: loading } =
    useSearchPreview(debouncedLocalQuery);

  const hasNoResults =
    debouncedLocalQuery.trim() !== "" && !loading && searchResults.length === 0;
  const showDropdown = isActive && (searchResults.length > 0 || hasNoResults);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isActive &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setIsActive(false);
      }
    };

    if (isActive) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isActive, setIsActive]);

  useEffect(() => {
    setIsActive(false);
    if (!location.pathname.includes("/search")) {
      clearSearch();
    }
  }, [location.pathname, clearSearch, setIsActive]);

  useEffect(() => {
    if (isActive && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isActive]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setLocalQuery(newValue);

    if (newValue === "") {
      clearSearch();
    } else if (!isActive) {
      setIsActive(true);
    }
  };

  const handleClearClick = () => {
    setLocalQuery("");
    clearSearch();
    searchRef.current?.querySelector("input")?.focus();
  };

  const handleSelectGame = (gameId) => {
    navigate(`/game/${gameId}`);
    clearSearch();
    setIsActive(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (localQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(localQuery)}`);
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
      // 🚀 CSS REPARADO: Se fuerza el top-0 left-0 y las medidas absolutas de la pantalla para el móvil
      className={`transition-all duration-200 ${
        isActive
          ? "fixed top-0 left-0 w-screen h-dvh z-1000 bg-gray-950/98 backdrop-blur-xl p-4 flex flex-col md:relative md:top-auto md:left-auto md:w-full md:max-w-xl md:h-auto md:z-100 md:bg-transparent md:p-0 md:block"
          : "relative w-full max-w-xl z-100"
      }`}
    >
      <div className="flex items-center gap-3 w-full shrink-0">
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

        <form
          onSubmit={handleSubmit}
          className="relative w-full transform -skew-x-12 group flex-1"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="absolute inset-0 bg-black translate-x-1 translate-y-1 md:translate-x-3 md:translate-y-3 rounded-sm transition-transform group-focus-within:translate-x-1.5 group-focus-within:translate-y-1.5 md:group-focus-within:translate-x-4 md:group-focus-within:translate-y-4"></div>

          <div className="absolute inset-0 bg-jinx-pink translate-x-0.5 translate-y-0.5 md:translate-x-1.5 md:translate-y-1.5 border border-black rounded-sm transition-transform group-focus-within:translate-x-1 group-focus-within:translate-y-1 md:group-focus-within:translate-x-2 md:group-focus-within:translate-y-2"></div>

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
              value={localQuery}
              onChange={handleInputChange}
              onFocus={() => setIsActive(true)}
              autoFocus={isActive && window.innerWidth < 768}
            />

            {localQuery && (
              <button
                type="button"
                onClick={handleClearClick}
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

      {showDropdown && (
        // 🚀 Z-index arreglado: z-[100] asegura la superposición correcta sobre otros elementos
        <div className="w-full z-100 mt-4 relative md:absolute md:top-full md:left-0 md:right-0 pb-4 md:pb-0">
          <div className="bg-black border-2 border-jinx-pink shadow-[4px_4px_0_#0aff60] transform skew-x-0 md:-skew-x-12 overflow-hidden flex flex-col">
            {searchResults.length > 0 ? (
              <>
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
                    &quot;{localQuery}&quot;
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

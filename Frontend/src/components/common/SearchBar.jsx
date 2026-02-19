import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2 } from 'lucide-react'; // Loader2 es un spinner animado (Poner el loader personalizado luego)
import useDebounce from '../../utils/debounce';
import api from '../../services/api'; 

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const searchRef = useRef(null); // Referencia para detectar clics fuera
  const debouncedQuery = useDebounce(query, 500);

  // 1. Lógica de Búsqueda (Efecto)
  useEffect(() => {
    const searchGames = async () => {
      if (!debouncedQuery.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        setLoading(true);
        // Asumo que tu API responde con { results: [...] }
        const response = await api.getGamesWithParams({ search: debouncedQuery, page_size: 5 });
        setSearchResults(response.results || []);
      } catch (error) {
        console.error('Error Search:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    searchGames();
  }, [debouncedQuery]);

  // 2. Manejo de Clics Fuera (Para cerrar el dropdown)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsActive(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 3. Handlers
  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setIsActive(true);
  };

  const handleClear = () => {
    setQuery('');
    setSearchResults([]);
    setIsActive(false);
  };

  const handleSelectGame = (gameId) => {
    navigate(`/game/${gameId}`); // Navegar al detalle del juego
    setIsActive(false);
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
      
      {/* --- FORMULARIO PRINCIPAL (Estilo Caja de Munición) --- */}
      <form 
        onSubmit={handleSubmit}
        className="relative w-full transform -skew-x-12 group"
        style={{ backfaceVisibility: 'hidden' }} // Fix bordes serrados
      >
        {/* Capas de Profundidad */}
        <div className="absolute inset-0 bg-black translate-x-3 translate-y-3 rounded-sm transition-transform group-focus-within:translate-x-4 group-focus-within:translate-y-4"></div>
        <div className="absolute inset-0 bg-jinx-pink translate-x-1.5 translate-y-1.5 border border-black rounded-sm transition-transform group-focus-within:translate-x-2 group-focus-within:translate-y-2"></div>

        {/* Contenedor Input */}
        <div className="relative flex items-center bg-[#f0f0f0] h-11 border-2 border-black rounded-sm">
          
          {/* Botón Buscar */}
          <button
            type="submit"
            className="h-full px-4 bg-jinx-pink text-white border-r-2 border-black hover:bg-black hover:text-jinx-pink transition-colors"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin transform skew-x-12" />
            ) : (
              <Search size={20} strokeWidth={3} className="transform skew-x-12" />
            )}
          </button>

          {/* Input */}
          <input
            type="text"
            className="w-full bg-transparent border-none outline-none focus:ring-0 text-black placeholder-gray-500 font-bold px-4 transform skew-x-12 uppercase tracking-wide"
            placeholder="Buscar juegos..."
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsActive(true)}
          />

          {/* Botón Borrar */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="h-full px-3 text-gray-400 hover:text-red-600 transition-colors"
            >
              <X size={20} strokeWidth={3} className="transform skew-x-12" />
            </button>
          )}
        </div>
      </form>

      {/* --- DROPDOWN DE RESULTADOS (Estilo Holograma/Lista) --- */}
      {isActive && searchResults.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-4 pl-4 pr-2">
          {/* Contenedor del Dropdown (También inclinado para coincidir) */}
          <div className="bg-black border-2 border-jinx-pink shadow-[4px_4px_0_#0aff60] transform -skew-x-12 overflow-hidden">
            <ul className="max-h-64 overflow-y-auto custom-scrollbar">
              {searchResults.map((game) => (
                <li 
                  key={game.id} 
                  onClick={() => handleSelectGame(game.id)}
                  className="px-4 py-3 border-b border-gray-800 cursor-pointer hover:bg-zaun-green hover:text-black transition-colors group flex items-center gap-3"
                >
                  {/* Imagen pequeña (si la API la trae) */}
                  {game.background_image && (
                    <img 
                      src={game.background_image} 
                      alt={game.name} 
                      className="w-8 h-8 object-cover border border-gray-600 transform skew-x-12 group-hover:border-black"
                    />
                  )}
                  {/* Texto del Juego */}
                  <span className="font-bold text-sm transform skew-x-12 truncate w-full group-hover:font-extrabold">
                    {game.name}
                  </span>
                </li>
              ))}
            </ul>
            
            {/* Pie del dropdown */}
            <div 
              onClick={handleSubmit}
              className="bg-gray-900 p-2 text-center text-xs text-jinx-pink uppercase font-bold cursor-pointer hover:bg-gray-800 border-t-2 border-jinx-pink transform skew-x-0"
            >
              <span className="inline-block transform skew-x-12">Ver todos los resultados &rarr;</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
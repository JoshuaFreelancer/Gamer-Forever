import React, { useState, useEffect } from 'react';
import useDebounce from '../../utils/debounce';
import api from '../../services/api';
import SearchIcon from '../assets/images/search_icon.png';
import Loader from '../../utils/Loader';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isActive, setIsActive] = useState(false); // Nuevo estado para indicar si la barra de búsqueda está activa
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const searchGames = async (searchQuery) => {
      try {
        setLoading(true);
        const response = await api.getGamesWithParams({ search: searchQuery });
        setSearchResults(response.results);
      } catch (error) {
        console.error('Error al buscar juegos:', error);
      } finally {
        setLoading(false);
      }
    };

    if (debouncedQuery) {
      searchGames(debouncedQuery);
    } else {
      setSearchResults([]);
    }
     // Activa la barra de búsqueda cuando se hace clic en ella
     const activateSearchBar = () => {
      setIsActive(true);
    };

    // Desactiva la barra de búsqueda cuando se hace clic en otra parte de la página
    const deactivateSearchBar = (event) => {
      if (!event.target.closest('.search-container')) {
        setIsActive(false);
      }
    };

    document.addEventListener('click', activateSearchBar);
    document.addEventListener('click', deactivateSearchBar);

    return () => {
      document.removeEventListener('click', activateSearchBar);
      document.removeEventListener('click', deactivateSearchBar);
    };
  }, [debouncedQuery]);

  const handleChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value); // Llama a la función onSearch al cambiar el valor
  };

  const handleSelectGame = (selectedGame) => {
    console.log('Juego seleccionado:', selectedGame);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className={`search-container ${isActive ? 'active' : ''}`}>
      <img src={SearchIcon} alt="Icono de búsqueda" className="search-icon" />
      <input
        type="text"
        placeholder="Buscar juegos..."
        value={query}
        onChange={handleChange}
        className="search-text"
      />

      {loading && <Loader />}

      {searchResults.length > 0 && (
       <div className={`search-results ${isActive ? 'visible' : ''}`}>
          <ul>
            {searchResults.map((game) => (
              <li key={game.id} onClick={() => handleSelectGame(game)}>
                {game.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
};

export default SearchBar;

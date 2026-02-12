import React, { useState, useEffect } from 'react';
import '../assets/styles/App.css';

// Importar íconos de `react-icons`
import { FaPlaystation, FaXbox, FaWindows, FaApple, FaLinux } from 'react-icons/fa';
import { SiNintendo, SiAndroid, SiIos } from 'react-icons/si';

const GameList = () => {
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const gamesPerPage = 3; // Número de juegos por página

  useEffect(() => {
    // Obtener lista de juegos utilizando la API de RAWG
    fetch("https://api.rawg.io/api/games?key=f91db0b1d11143638d9547da8056c0b4&ordering=-added&dates=2024-01-01,2024-12-31")
      .then(response => response.json())
      .then(data => {
        // Guardar la lista de juegos en el estado
        setGames(data.results);
      })
      .catch(error => console.error(error));
  }, []);

  // Calcular los juegos a mostrar en la página actual
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = games.slice(indexOfFirstGame, indexOfLastGame);

  // Función para cambiar a la página siguiente
  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(games.length / gamesPerPage)));
  };

  // Función para cambiar a la página anterior
  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // Función para renderizar las estrellas de calificación
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating); // Estrellas llenas
    const hasHalfStar = rating % 1 !== 0; // Comprobar si hay media estrella

    // Renderizar hasta 5 estrellas con relleno basado en el rating
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="star full">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="star half">★</span>);
      } else {
        stars.push(<span key={i} className="star empty">☆</span>);
      }
    }

    return stars;
  };

  // Función para renderizar íconos de plataformas
  const renderPlatformIcons = (platforms) => {
    return platforms.map(platform => {
      const platformName = platform.platform.name.toLowerCase();

      // Asignar íconos basados en el nombre de la plataforma
      let IconComponent;
      switch (platformName) {
        case 'pc':
          IconComponent = FaWindows;
          break;
        case 'playstation':
          IconComponent = FaPlaystation;
          break;
        case 'xbox':
          IconComponent = FaXbox;
          break;
        case 'nintendo':
          IconComponent = SiNintendo;
          break;
        case 'linux':
          IconComponent = FaLinux;
          break;
        case 'mac':
          IconComponent = FaApple;
          break;
        case 'ios':
          IconComponent = SiIos;
          break;
        case 'android':
          IconComponent = SiAndroid;
          break;
        default:
          IconComponent = FaApple; // Ícono predeterminado
          break;
      }

      return (
        <IconComponent
          key={platform.platform.id}
          className="platform-icon"
          title={platform.platform.name} // Nombre visible al pasar el ratón sobre el ícono
        />
      );
    });
  };

  // Función para formatear la fecha
  const formatReleaseDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="gameList-container">
      <h3 className="gameList-title">LISTA DE<span> JUEGOS</span></h3>
      <div className="green-bar"></div>
      <ul className="gameList-ul">
        {currentGames.map(game => (
          <li key={game.id} className="gameList-item">
            <div className="gameList-image-container">
              <img src={game.background_image} alt={`${game.name} cover`} className="gameList-image" />
              <div className="gameList-stars">
                {renderStars(game.rating)}
              </div>
            </div>
            <div className='gameList-info'>
              <div className="gameList-platforms">
                {renderPlatformIcons(game.parent_platforms)}
              </div>
              <h4 className="gameList-name">{game.name}</h4>
              <p className="gameList-genre"><span className="dot">•</span><span>Género:</span> {game.genres.map(genre => genre.name).join(', ')}</p>
              <div className="white-bar"></div>
              <p className="gameList-release"><span className="dot">•</span><span>Fecha de lanzamiento:</span> {formatReleaseDate(game.released)}</p>
              <button className="gameList-button">VER MÁS</button>
            </div>
          </li>
        ))}
      </ul>
      
      {/* Controles de paginación */}
      <div className="pagination-container">
        <button
          className="pagination-button"
          onClick={prevPage}
          disabled={currentPage === 1} // Deshabilitar si es la primera página
        >
         Anterior
        </button>
        <span className="pagination-info">Página {currentPage} de {Math.ceil(games.length / gamesPerPage)}</span>
        <button
          className="pagination-button"
          onClick={nextPage}
          disabled={currentPage === Math.ceil(games.length / gamesPerPage)} // Deshabilitar si es la última página
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default GameList;

import React from 'react';
import '../assets/styles/App.css';

const DiscordBanner = () => {
  return (
    <section className="discord-banner" aria-labelledby="discord-banner-heading">
      <div className="content-container">
        <h2 id="discord-banner-heading">
          ÚNETE A NUESTRA <span>COMUNIDAD</span>
        </h2>
        <p>
          Una comunidad de Discord creada y mantenida por jugadores para jugadores.
          Todos son bienvenidos a unirse, sin importar el juego que juegues; ¡estamos aquí para divertirnos!
        </p>
        <a 
          href="https://discord.com/invite/WwXkCGHjBx" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="discord-button"
        >
          ÚNETE A DISCORD
        </a>
      </div>
    </section>
  );
};

export default DiscordBanner;

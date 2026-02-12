import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, User } from 'lucide-react'; 
import Logo from '../assets/images/logo_gamer_forever.png';
import NameLogo from '../assets/images/name_gamer_forever.png';

const Header = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full h-20 bg-dark-bg/80 backdrop-blur-md border-b border-white/5 shadow-lg shadow-neon-pink/5">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
        
        {/* 1. IDENTIDAD (Logo) */}
        <Link to="/" className="flex items-center gap-2 group">
          <img 
            src={Logo} 
            alt="Logo" 
            className="h-10 w-auto object-contain transition-transform group-hover:scale-110 drop-shadow-[0_0_5px_rgba(255,0,94,0.5)]" 
          />
          <img 
            src={NameLogo} 
            alt="Gamer Forever" 
            className="h-6 w-auto object-contain hidden sm:block opacity-90 group-hover:opacity-100 transition-opacity" 
          />
        </Link>

        {/* 2. BARRA DE BÚSQUEDA */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4 relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {/* El icono cambia a Verde Neón cuando escribes */}
            <Search className="h-5 w-5 text-gray-500 group-focus-within:text-neon-green transition-colors duration-300" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 
                       bg-dark-surface border border-gray-700 rounded-full leading-5 
                       text-gray-100 placeholder-gray-500 
                       focus:outline-none focus:bg-black 
                       focus:border-neon-green focus:ring-1 focus:ring-neon-green 
                       transition-all shadow-inner"
            placeholder="Buscar juegos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-600 text-xs border border-gray-600 rounded px-1.5 py-0.5 hidden md:block group-focus-within:border-neon-green/50 group-focus-within:text-neon-green transition-colors">
              /
            </span>
          </div>
        </form>

        {/* 3. ZONA DE USUARIO */}
        <div className="flex items-center gap-4">
          
          {/* Botón de Notificaciones */}
          <button className="relative p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors group">
            <Bell size={22} className="group-hover:text-neon-pink transition-colors" />
            {/* Punto de notificación en Fucsia Neón con pulsación */}
            <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-neon-pink shadow-[0_0_8px_#FF005E] animate-pulse"></span>
          </button>

          {/* Avatar / Perfil */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold text-white">Guest User</span>
              {/* Estado Online en Verde Neón */}
              <span className="text-[10px] uppercase tracking-wider text-neon-green drop-shadow-[0_0_3px_#00FF69]">Online</span>
            </div>
            
            {/* Borde del avatar con Gradiente de tu marca (Fucsia a Verde) */}
            <button className="h-10 w-10 rounded-full bg-gradient-to-tr from-neon-pink to-neon-green p-[2px] cursor-pointer hover:shadow-[0_0_15px_var(--color-neon-pink)] transition-shadow duration-300">
              <div className="h-full w-full rounded-full bg-dark-bg flex items-center justify-center overflow-hidden">
                <User size={20} className="text-gray-200" />
              </div>
            </button>
          </div>

          {/* Menú Hamburguesa (Móvil) */}
          <button className="md:hidden p-2 rounded-md text-gray-400 hover:text-neon-pink transition-colors">
            <Menu size={26} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
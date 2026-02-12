import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Gamepad2, 
  Twitter, 
  Instagram, 
  Facebook, 
  Youtube, 
  Twitch, 
  Heart 
} from 'lucide-react';
import Logo from '../assets/images/logo_gamer_forever.png';
import NameLogo from '../assets/images/name_gamer_forever.png';

const Footer = () => {
  return (
    <footer className="relative bg-dark-surface border-t border-white/5 overflow-hidden">
      
      {/* Efecto de brillo superior (Luz ambiental) */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-neon-pink/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* 1. SECCIÓN DE IDENTIDAD */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={Logo} 
                alt="Logo Gamer Forever" 
                className="h-12 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,0,94,0.3)]" 
              />
              <img 
                src={NameLogo} 
                alt="Gamer Forever" 
                className="h-6 w-auto object-contain brightness-150" 
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Tu nexo digital para descubrir mundos virtuales. Catálogo exhaustivo, 
              reseñas críticas y la base de datos más actualizada para el gamer moderno.
            </p>
          </div>

          {/* 2. ENLACES RÁPIDOS (Estilo Terminal) */}
          <div className="flex flex-col">
            <h2 className="text-neon-green font-bold tracking-widest text-sm mb-6 uppercase drop-shadow-[0_0_5px_rgba(0,255,105,0.4)]">
              Acceso Rápido
            </h2>
            <ul className="space-y-3">
              {['Juegos', 'Categorías', 'Plataformas', 'Desarrolladoras'].map((item) => (
                <li key={item}>
                  <Link 
                    to="#" 
                    className="text-gray-400 hover:text-neon-green hover:pl-2 transition-all duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-neon-green transition-colors"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. SOCIAL MEDIA (Botones Holográficos) */}
          <div className="flex flex-col">
            <h2 className="text-neon-pink font-bold tracking-widest text-sm mb-6 uppercase drop-shadow-[0_0_5px_rgba(255,0,94,0.4)]">
              Conecta
            </h2>
            <div className="flex flex-wrap gap-4">
              <SocialIcon icon={Gamepad2} href="https://discord.com" label="Discord" />
              <SocialIcon icon={Twitter} href="https://twitter.com" label="Twitter" />
              <SocialIcon icon={Instagram} href="https://instagram.com" label="Instagram" />
              <SocialIcon icon={Twitch} href="https://twitch.tv" label="Twitch" />
              <SocialIcon icon={Youtube} href="https://youtube.com" label="Youtube" />
            </div>
            
            {/* Newsletter Input (Opcional - Toque Pro) */}
            <div className="mt-6">
              <p className="text-xs text-gray-500 mb-2">Suscríbete al boletín semanal</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="tu@email.com" 
                  className="bg-black/50 border border-gray-700 text-white text-sm rounded-l-md px-3 py-2 w-full focus:outline-none focus:border-neon-pink"
                />
                <button className="bg-neon-pink/20 border border-neon-pink text-neon-pink px-3 py-2 rounded-r-md hover:bg-neon-pink hover:text-white transition-all">
                  Go
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* LÍNEA DIVISORIA NEÓN */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-700 to-transparent my-8"></div>

        {/* COPYRIGHT & LEGAL */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p>&copy; {new Date().getFullYear()} Gamer Forever. Todos los derechos reservados.</p>
          
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              Powered by <a href="https://rawg.io/" target="_blank" rel="noreferrer" className="text-white hover:text-neon-pink underline decoration-dotted">RAWG API</a>
            </span>
            <span className="flex items-center gap-1">
              Coded with <Heart size={12} className="text-neon-pink fill-neon-pink animate-pulse" /> by <span className="text-neon-green">Joshua Freelancer</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Componente auxiliar para los iconos sociales (Reutilizable)
const SocialIcon = ({ icon: Icon, href, label }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noreferrer" 
    aria-label={label}
    className="p-3 bg-white/5 rounded-lg border border-white/5 
               hover:bg-neon-pink/10 hover:border-neon-pink hover:text-neon-pink hover:scale-110 hover:shadow-[0_0_15px_rgba(255,0,94,0.4)]
               text-gray-400 transition-all duration-300"
  >
    <Icon size={20} />
  </a>
);

export default Footer;
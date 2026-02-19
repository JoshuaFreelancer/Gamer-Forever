import { useQuery } from '@tanstack/react-query';
import API from '../services/api';
import Hero from '../components/home/Hero'; 
import GameList from '../components/home/GameList'; 
import DiscordBanner from '../components/home/DiscordBanner';
import CategoriesList from '../components/home/CategoriesList';
import { Loader2, AlertCircle } from 'lucide-react';

const Home = () => {
  // 1. Hook de React Query (Solo para el Hero)
  const { 
    data: popularGames, 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['popularGames'],
    queryFn: API.getPopularGames, 
    staleTime: 1000 * 60 * 10, // 10 minutos de frescura
  });

  // 2. Estado de Carga
  if (isLoading) {
    return (
      <div className="h-screen w-full bg-void-purple flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 animate-spin text-jinx-pink mb-4" />
        <p className="text-gray-400 font-mono animate-pulse tracking-widest">CARGANDO SISTEMA...</p>
      </div>
    );
  }

  // 3. Estado de Error
  if (isError) {
    return (
      <div className="h-screen w-full bg-void-purple flex flex-col items-center justify-center text-red-500">
        <AlertCircle className="w-16 h-16 mb-4 opacity-80" />
        <h2 className="text-2xl font-bold font-marker tracking-widest">ERROR DE CONEXIÓN</h2>
        <p className="text-gray-400 mt-2 font-mono">{error.message || "No se pudo conectar con el servidor."}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-6 px-8 py-2 bg-red-500/10 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold tracking-widest skew-x-12"
        >
          <span className="-skew-x-12 block">REINTENTAR</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 min-h-screen text-white selection:bg-jinx-pink selection:text-white">
      
      {/* --- SECCIÓN HERO (Cinemático) --- */}
      <header className="relative z-10 w-full">
        {popularGames && popularGames.length > 0 ? (
          <Hero games={popularGames} />
        ) : (
          <div className="h-125 flex items-center justify-center bg-black text-gray-500">
            No hay destacados disponibles.
          </div>
        )}
      </header>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="w-full">
        
        {/* 1. Lista de Juegos (Grid + Paginación) */}
        <GameList />

        {/* 2. Banner de Comunidad (Invitación a Discord) */}
        <DiscordBanner />

        <CategoriesList />
        
      </main>
    </div>
  );
};

export default Home;
import { useQuery } from '@tanstack/react-query';
import API from '../services/api';
import Hero3D from '../components/home/Hero3D';
import { Loader2, AlertCircle } from 'lucide-react'; // Iconos ligeros

const Home = () => {
  // 1. Hook de React Query: Maneja caché, loading y error automáticamente
  const { 
    data: popularGames, 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['popularGames'],
    queryFn: API.getPopularGames, // Usa la función optimizada que creamos antes
    staleTime: 1000 * 60 * 10, // Los datos duran frescos 10 minutos
  });

  // 2. Estado de Carga (Diseño limpio)
  if (isLoading) {
    return (
      <div className="h-screen w-full bg-gray-900 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
        <p className="text-gray-400 font-mono animate-pulse">Cargando catálogo...</p>
      </div>
    );
  }

  // 3. Estado de Error
  if (isError) {
    return (
      <div className="h-screen w-full bg-gray-900 flex flex-col items-center justify-center text-red-400">
        <AlertCircle className="w-16 h-16 mb-4 opacity-80" />
        <h2 className="text-2xl font-bold">Error de conexión</h2>
        <p className="text-gray-500 mt-2">{error.message}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-6 px-6 py-2 bg-red-500/20 border border-red-500 rounded-full hover:bg-red-500/40 transition"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      {/* Aquí insertamos el componente Hero 3D */}
      <header className="relative z-10">
        <Hero3D games={popularGames} />
      </header>

      {/* Contenido del resto de la página (Placeholder por ahora) */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6 border-l-4 border-purple-500 pl-4">
          Explora más títulos
        </h2>
        <p className="text-gray-400">
          Aquí irá la grilla de juegos con scroll infinito y filtros avanzados...
        </p>
      </main>
    </div>
  );
};

export default Home;
import { useEffect } from "react";
import Hero from "../components/home/Hero";
import GameList from "../components/home/GameList";
import DiscordBanner from "../components/home/DiscordBanner";
import CategoriesList from "../components/home/CategoriesList";
import { Loader2, AlertCircle } from "lucide-react";

// 🚀 CORRECCIÓN: Apuntamos a nuestro archivo maestro unificado
import { usePopularGames } from "../hooks/useGamesData";

const Home = () => {
  // 🚀 FUERZA EL INICIO ARRIBA: Asegura que al entrar a la ruta empiece en la cima
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 🚀 LA MAGIA DEL HOOK: Todo el código de React Query está oculto y reutilizable
  const { data: popularGames, isLoading, isError, error } = usePopularGames();

  return (
    // 🚀 BUG CORREGIDO: Cambiamos overflow-hidden a overflow-x-hidden para permitir el scroll hacia abajo
    <div className="bg-gray-950 min-h-screen text-white selection:bg-jinx-pink selection:text-white overflow-x-hidden">
      {/* 🚀 MEJORA MÓVIL: min-h-[60svh] en móvil asegura que se asome un poco el contenido de abajo para invitar al scroll. 80vh en PC. */}
      <header className="relative z-10 w-full min-h-[60svh] md:min-h-[80vh] bg-black">
        {isLoading ? (
          // 🚀 MEJORA UX: Fondo bg-gray-900 con animate-pulse para un efecto skeleton más completo
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 animate-pulse border-b-2 border-gray-900">
            {/* 🚀 Tamaños de ícono y texto fluidos */}
            <Loader2 className="w-10 h-10 md:w-12 md:h-12 animate-spin text-jinx-pink mb-4" />
            <p className="text-gray-400 font-mono tracking-widest text-xs md:text-sm">
              CARGANDO DESTACADOS...
            </p>
          </div>
        ) : isError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center border-b-2 border-gray-900 bg-gray-950 text-red-500">
            <AlertCircle className="w-10 h-10 md:w-12 md:h-12 mb-4 opacity-80" />
            <p className="text-gray-400 mt-2 font-mono text-center px-4 text-xs md:text-sm">
              {error?.message || "Fallo satelital de la API."}
            </p>
          </div>
        ) : popularGames && popularGames.length > 0 ? (
          <Hero games={popularGames} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-mono text-sm md:text-base">
            Archivo de destacados vacío.
          </div>
        )}
      </header>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="w-full flex flex-col">
        <GameList />
        <DiscordBanner />
        <CategoriesList />
      </main>
    </div>
  );
};

export default Home;

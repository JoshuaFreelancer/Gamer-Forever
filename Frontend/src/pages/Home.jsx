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
    <div className="bg-gray-950 min-h-screen text-white selection:bg-jinx-pink selection:text-white overflow-hidden">
      {/* --- SECCIÓN HERO (Con Loader Local y prevención de CLS) --- */}
      <header className="relative z-10 w-full min-h-[70vh] bg-black">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center border-b-2 border-gray-900">
            <Loader2 className="w-12 h-12 animate-spin text-jinx-pink mb-4" />
            <p className="text-gray-400 font-mono animate-pulse tracking-widest">
              CARGANDO DESTACADOS...
            </p>
          </div>
        ) : isError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center border-b-2 border-gray-900 text-red-500">
            <AlertCircle className="w-12 h-12 mb-4 opacity-80" />
            <p className="text-gray-400 mt-2 font-mono text-center px-4">
              {error?.message || "Fallo satelital de la API."}
            </p>
          </div>
        ) : popularGames && popularGames.length > 0 ? (
          <Hero games={popularGames} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-mono">
            Archivo de destacados vacío.
          </div>
        )}
      </header>

      {/* --- CONTENIDO PRINCIPAL (Carga en paralelo gracias a React Query) --- */}
      <main className="w-full flex flex-col">
        <GameList />
        <DiscordBanner />
        <CategoriesList />
      </main>
    </div>
  );
};

export default Home;

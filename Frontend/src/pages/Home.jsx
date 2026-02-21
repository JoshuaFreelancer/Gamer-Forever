import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import API from "../services/api";
import Hero from "../components/home/Hero";
import GameList from "../components/home/GameList";
import DiscordBanner from "../components/home/DiscordBanner";
import CategoriesList from "../components/home/CategoriesList";
import { Loader2, AlertCircle } from "lucide-react";

const Home = () => {
  // 🚀 FUERZA EL INICIO ARRIBA: Asegura que al entrar a la ruta empiece en la cima
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Hook de React Query (Solo para el Hero)
  const {
    data: popularGames,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["popularGames"],
    queryFn: API.getPopularGames,
    staleTime: 1000 * 60 * 10,
  });

  return (
    <div className="bg-gray-950 min-h-screen text-white selection:bg-jinx-pink selection:text-white">
      {/* --- SECCIÓN HERO (Con Loader Local) --- */}
      {/* min-h-[70vh] reserva el espacio en la pantalla para evitar que el contenido salte */}
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
            <p className="text-gray-400 mt-2 font-mono">
              {error.message || "Fallo satelital."}
            </p>
          </div>
        ) : popularGames && popularGames.length > 0 ? (
          <Hero games={popularGames} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-mono">
            No hay destacados disponibles.
          </div>
        )}
      </header>

      {/* --- CONTENIDO PRINCIPAL (Ahora cargan en paralelo sin bloqueos) --- */}
      <main className="w-full">
        <GameList />
        <DiscordBanner />
        <CategoriesList />
      </main>
    </div>
  );
};

export default Home;

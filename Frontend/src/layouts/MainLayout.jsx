import { Outlet } from 'react-router-dom';
import Header from './Header';
import NavBar from './NavBar';
import Footer from './Footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white font-sans">
      {/* 1. Cabecera Principal (Logo, Login, Buscador Global) */}
      <Header />

      {/* 2. Barra de Navegación (Menú de Categorías/Links) */}
      {/* Nota: Si quieres que sea "sticky" (pegajosa al hacer scroll), agrega 'sticky top-0 z-50' */}
      <NavBar />

      {/* 3. Contenido Dinámico (Aquí se inyecta Home, GameDetails, etc.) */}
      <main className="grow">
        <Outlet /> 
      </main>

      {/* 4. Pie de Página */}
      <Footer />
    </div>
  );
};

export default MainLayout;
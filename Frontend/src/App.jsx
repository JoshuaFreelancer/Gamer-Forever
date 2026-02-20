import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';

// 🚀 Componentes de las páginas
import GameDetails from './pages/GameDetails'; 
import SearchResults from './pages/SearchResults';

// import Login from './pages/Login';

function App() {
  return (
    <Routes>
      {/* Ruta Principal con el Layout Base */}
      <Route path="/" element={<MainLayout />}>
        
        {/* Índice: La página Home con el Hero */}
        <Route index element={<Home />} />
        
        {/* 🚀 Ruta dinámica para los detalles del juego */}
        <Route path="game/:id" element={<GameDetails />} />
        
        {/* 🚀 Ruta para la página de búsqueda */}
        <Route path="search" element={<SearchResults />} />
        
      </Route>

      {/* Rutas sin Navbar/Footer (Como Login o 404) */}
      {/* <Route path="/login" element={<Login />} /> */}
    </Routes>
  );
}

export default App;
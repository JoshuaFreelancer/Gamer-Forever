import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';

// Si tienes estas páginas creadas, impórtalas, si no, déjalas comentadas
// import GameDetails from './pages/GameDetails';
// import Login from './pages/Login';

function App() {
  return (
    <Routes>
      {/* Ruta Principal con el Layout Base */}
      <Route path="/" element={<MainLayout />}>
        
        {/* Índice: La página Home con el Hero 3D */}
        <Route index element={<Home />} />
        
        {/* Futuras Rutas (Prepárate para esto) */}
        {/* <Route path="game/:id" element={<GameDetails />} /> */}
        {/* <Route path="search" element={<SearchResults />} /> */}
        
      </Route>

      {/* Rutas sin Navbar/Footer (Como Login o 404) */}
      {/* <Route path="/login" element={<Login />} /> */}
    </Routes>
  );
}

export default App;
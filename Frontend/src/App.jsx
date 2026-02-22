import { Suspense, lazy, useState, useEffect } from "react";
import { Routes, Route, Outlet } from "react-router-dom";

// 1. IMPORTACIONES NORMALES (Eager Loading)
import MainLayout from "./layouts/MainLayout";
import Loader from "./utils/Loader";
import Home from "./pages/Home";

// 🚀 EL COMPONENTE ANTI-PARPADEO (Ajustado)
const DelayedFallback = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 250);
    return () => clearTimeout(timer);
  }, []);

  // Retornamos 'null' para que simplemente no haya contenido por 250ms.
  // Como el MainLayout ya no se desmonta, se verá el fondo natural de la app sin flashes raros.
  if (!show) return null;

  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center">
      <Loader size="w-20 h-20" />
      <span className="text-gray-500 font-mono mt-4 animate-pulse tracking-widest text-sm">
        CARGANDO SISTEMA...
      </span>
    </div>
  );
};

// 🚀 2. IMPORTACIONES DINÁMICAS (LAZY LOADING)
const Categories = lazy(() => import("./pages/Categories"));
const Platforms = lazy(() => import("./pages/Platforms"));
const Developers = lazy(() => import("./pages/Developers"));
const GameDetails = lazy(() => import("./components/common/GameDetails"));
const SearchResults = lazy(() => import("./components/common/SearchResults"));

// 🚀 3. WRAPPER INTELIGENTE PARA EL SUSPENSE
// Esto asegura que el Suspense solo afecte a las páginas, NO al Navbar/Footer
const SuspenseWrapper = () => (
  <Suspense fallback={<DelayedFallback />}>
    <Outlet />
  </Suspense>
);

function App() {
  return (
    // Ya no hay Suspense aquí afuera destruyendo la app entera
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Home está fuera del SuspenseWrapper porque no es Lazy */}
        <Route index element={<Home />} />

        {/* Todas las rutas Lazy van dentro de este wrapper especial */}
        <Route element={<SuspenseWrapper />}>
          <Route path="game/:id" element={<GameDetails />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="categories" element={<Categories />} />
          <Route path="platforms" element={<Platforms />} />
          <Route path="developers" element={<Developers />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

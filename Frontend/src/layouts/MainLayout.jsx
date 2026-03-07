import { Outlet, useLocation } from "react-router-dom";
import { m, AnimatePresence } from "framer-motion";
import Header from "./Header";
import NavBar from "./NavBar";
import Footer from "./Footer";

// --- CONFIGURACIÓN SIMPLE, RÁPIDA Y CON DESLIZAMIENTO ---
const pageVariants = {
  initial: {
    opacity: 0,
    y: 15,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  },
};

const MainLayout = () => {
  const location = useLocation();

  return (
    // Contenedor Maestro: Ocupa siempre al menos 1 pantalla completa
    <div className="flex flex-col min-h-screen w-full bg-gray-950 text-white font-sans overflow-x-hidden">
      {/* 🚀 Header ya tiene su propio 'sticky top-0' internamente */}
      <Header />

      {/* 🚀 MEJORA 1: 'hidden md:block' elimina el rastro fantasma en móvil */}
      {/* 🚀 MEJORA 2: 'top-24' porque en PC tu Header mide h-24 (96px). 
          Así, al hacer scroll, el NavBar se pega justo DEBAJO del Header y no lo tapa. */}
      <div className="hidden md:block sticky top-24 z-50 bg-gray-950/95 border-b border-gray-800 shadow-md">
        <NavBar />
      </div>

      {/* 🚀 MEJORA 3: Eliminado el min-h-screen extra. 
          'grow' flex-1 es todo lo que necesitas para empujar el Footer al fondo. */}
      <main className="grow relative flex flex-col w-full">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            // Se asegura de que la animación ocupe todo el espacio disponible
            className="w-full grow flex flex-col"
          >
            <Outlet />
          </m.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;

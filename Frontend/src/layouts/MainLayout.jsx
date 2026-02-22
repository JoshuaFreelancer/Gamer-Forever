import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import NavBar from './NavBar';
import Footer from './Footer';

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
      ease: 'easeIn',
    },
  },
};

const MainLayout = () => {
  const location = useLocation();

  return (
    // 🚀 ELIMINADO overflow-y-scroll y agregado w-full para que ocupe el 100% exacto de la pantalla
    <div className="flex flex-col min-h-screen w-full bg-gray-950 text-white font-sans overflow-x-hidden">
      
      <Header />

      <div className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-sm border-b border-white/10">
        <NavBar />
      </div>

      {/* min-h-screen mantiene el Footer abajo y fuerza el scroll natural suavemente */}
      <main className="grow relative min-h-screen flex flex-col">
        
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className="w-full grow flex flex-col" 
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
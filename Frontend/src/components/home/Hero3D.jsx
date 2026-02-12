import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Calendar } from "lucide-react";

const Hero3D = ({ games }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Autoplay: El stand gira solo cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % games.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + games.length) % games.length);
  };

  // Lógica para determinar la posición 3D de cada tarjeta
  const getCardStyle = (index) => {
    // Calculamos la distancia relativa considerando el array circular
    const total = games.length;
    const distance = (index - activeIndex + total) % total;

    // Centro (Héroe)
    if (distance === 0) {
      return {
        x: 0,
        scale: 1,
        zIndex: 50,
        opacity: 1,
        rotateY: 0,
        filter: "brightness(1.1)",
      };
    }
    // Inmediato a la derecha
    if (distance === 1) {
      return {
        x: 200, // Mover a la derecha
        scale: 0.8,
        zIndex: 40,
        opacity: 0.7,
        rotateY: -30, // Rotar hacia adentro
        filter: "blur(2px) brightness(0.6)",
      };
    }
    // Inmediato a la izquierda (o el último del array)
    if (distance === total - 1) {
      return {
        x: -200, // Mover a la izquierda
        scale: 0.8,
        zIndex: 40,
        opacity: 0.7,
        rotateY: 30, // Rotar hacia adentro
        filter: "blur(2px) brightness(0.6)",
      };
    }
    // Los de atrás (ocultos o muy lejanos)
    return {
      x: 0,
      scale: 0.5,
      zIndex: 10,
      opacity: 0,
      rotateY: 0,
      filter: "blur(10px)",
    };
  };

  if (!games || games.length === 0) return null;

  // Fondo dinámico basado en el juego activo (Efecto inmersivo)
  const activeGame = games[activeIndex];

  return (
    <div className="relative w-full h-150 flex items-center justify-center overflow-hidden bg-black perspective-1000">
      
      {/* Fondo Ambiental Difuminado */}
      <motion.div 
        key={activeGame.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-cover bg-center blur-3xl scale-110 z-0"
        style={{ backgroundImage: `url(${activeGame.background_image})` }}
      />
      <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-transparent to-gray-900 z-0" />

      {/* Contenedor del Stand 3D */}
      <div className="relative w-full max-w-5xl h-100 flex items-center justify-center z-10 perspective-1000">
        <AnimatePresence mode="popLayout">
          {games.map((game, index) => {
            const style = getCardStyle(index);
            
            // Solo renderizamos los visibles para performance
            if (style.opacity === 0) return null;

            return (
              <motion.div
                key={game.id}
                initial={false}
                animate={style}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute w-75 md:w-150 h-87.5 md:h-100 rounded-2xl shadow-2xl overflow-hidden border border-white/10 bg-gray-800"
                style={{
                  transformStyle: "preserve-3d", // Clave para el 3D real
                }}
              >
                {/* Imagen del Juego */}
                <img
                  src={game.background_image}
                  alt={game.name}
                  className="w-full h-full object-cover"
                  loading={style.zIndex === 50 ? "eager" : "lazy"} // Optimización Lighthouse
                />

                {/* Overlay de información (Solo visible en el central) */}
                <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/90 via-black/60 to-transparent p-6 text-white translate-z-10">
                  <motion.h2 
                    className="text-3xl font-bold truncate text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500"
                    animate={{ opacity: style.zIndex === 50 ? 1 : 0 }}
                  >
                    {game.name}
                  </motion.h2>
                  
                  {style.zIndex === 50 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center gap-4 mt-2"
                    >
                      <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1 rounded-full text-yellow-400 border border-yellow-500/30">
                        <Star size={16} fill="currentColor" />
                        <span className="font-bold">{game.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-300 text-sm">
                        <Calendar size={16} />
                        <span>{game.released?.split("-")[0]}</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Controles de Navegación */}
      <div className="absolute inset-x-0 flex justify-center gap-8 bottom-10 z-20">
        <button 
          onClick={handlePrev}
          className="p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all border border-white/10 group"
        >
          <ChevronLeft size={30} className="text-white group-hover:-translate-x-1 transition-transform" />
        </button>
        <button 
          onClick={handleNext}
          className="p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all border border-white/10 group"
        >
          <ChevronRight size={30} className="text-white group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
};

export default Hero3D;
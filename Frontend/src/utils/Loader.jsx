const Loader = ({ size = "w-5 h-5" }) => {
  return (
    <div className={`relative flex items-center justify-center ${size}`}>
      
      {/* 1. La "Sombra" del giro (Efecto de rastro) */}
      <div className="absolute inset-0 border-2 border-jinx-pink opacity-30 rounded-[30%] blur-[1px]"></div>

      {/* 2. El Spinner Principal (Tuerca Tóxica) */}
      {/* - animate-spin: La rotación.
          - border-2: Grosor adecuado para iconos pequeños.
          - rounded-[30%]: La forma "squircle" original que te gustaba.
          - Colores: Base Rosa, Tope Verde Zaun, Derecha Transparente (efecto roto).
      */}
      <div 
        className="w-full h-full border-2 border-jinx-pink border-t-zaun-green border-r-transparent rounded-[30%] animate-spin shadow-[0_0_10px_#0aff60]"
        style={{ animationDuration: '0.8s' }} // Un poco más rápido y frenético
      ></div>
    </div>
  );
};

export default Loader;
const Loader = ({ size = "w-16 h-16", className = "" }) => {
  // Aumenté el tamaño por defecto a w-16 h-16 ya que ahora será un loader de página principal,
  // pero puedes seguir pasándole "w-5 h-5" para usarlo en botones pequeños.

  return (
    <div
      className={`relative flex items-center justify-center ${size} ${className}`}
    >
      {/* 1. Sombra de neón caótica de fondo */}
      <div className="absolute inset-0 rounded-[30%] bg-linear-to-tr from-zaun-green to-jinx-pink opacity-30 blur-md animate-pulse"></div>

      {/* 2. La Tuerca Principal (Exterior) */}
      {/* - border-[4px]: Borde más grueso para aspecto de hardware.
          - Mitad y Mitad: Top y Right (Rosa), Bottom y Left (Verde).
          - rounded-[30%]: Forma de tuerca cuadrada/squircle.
      */}
      <div
        className="absolute inset-0 border-4 border-t-jinx-pink border-r-jinx-pink border-b-zaun-green border-l-zaun-green rounded-[30%] animate-spin shadow-[0_0_15px_rgba(10,255,96,0.3)]"
        style={{ animationDuration: "0.8s" }} // Giro rápido
      ></div>

      {/* 3. Engranaje/Rosca Interna (Gira al revés) */}
      {/* - border-dashed: Da la ilusión de dientes de engranaje o rosca.
          - animationDirection: 'reverse' crea la ilusión mecánica.
      */}
      <div
        className="absolute inset-2 border-[3px] border-dashed border-t-zaun-green border-l-zaun-green border-b-jinx-pink border-r-jinx-pink rounded-full animate-spin"
        style={{ animationDirection: "reverse", animationDuration: "1.2s" }}
      ></div>

      {/* 4. Eje central de la tuerca (Agujero rosa) */}
      <div className="absolute w-2 h-2 bg-jinx-pink rounded-full border border-zaun-green shadow-[inset_0_0_4px_#000]"></div>
    </div>
  );
};

export default Loader;

// utils/debounce.js
import { useEffect, useState } from 'react';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // AJUSTE PRO: Limpieza Inmediata
    // Si el valor está vacío, actualizamos al instante.
    // Esto hace que la UI se sienta más rápida (Snappy) al borrar.
    if (value === '') {
      setDebouncedValue('');
      return;
    }

    // Lógica estándar para cuando el usuario está escribiendo
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancela el temporizador anterior si el usuario sigue escribiendo
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
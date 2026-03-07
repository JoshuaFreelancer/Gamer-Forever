import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { scan } from 'react-scan';

// Configuración del cliente:
// staleTime: 5 min (Los datos se consideran frescos por 5 minutos antes de volver a pedir)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, 
      refetchOnWindowFocus: false, // Evita recargas molestas al cambiar de pestaña
    },
  },
});

// LO ENCENDEMOS SOLO EN DESARROLLO (Vite)
if (import.meta.env.DEV) {
  scan({
    enabled: true,
    log: true, // Opcional: Esto también imprimirá en la consola de Chrome por qué ocurrió el render
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}> {/* 👈 Envolver App */}
      {/* Proveedor de Router para la navegación */}
      <BrowserRouter>
      <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
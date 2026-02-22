import axios from "axios";

// Creamos una instancia limpia.
// Ahora la baseURL es TU servidor, no el de RAWG.
const instance = axios.create({
  // Vite expone variables de entorno con import.meta.env
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  // ¡YA NO HAY PARAMS CON KEY AQUÍ!
});

export default instance;

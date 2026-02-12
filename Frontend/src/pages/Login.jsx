import React, { useState } from 'react';
import axios from 'axios';

const LoginComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });

      // Manejar la respuesta del backend aquí (guardar token, redireccionar, etc.)
      console.log('Inicio de sesión exitoso:', response.data);

      // Aquí podrías guardar el token en el estado o utilizar algún sistema de gestión de estado global
      // También podrías redirigir al usuario a otra página si el inicio de sesión es exitoso
    } catch (error) {
      console.error('Error de inicio de sesión:', error.response.data);
    }
  };

  return (
    <div>
      <h2>Formulario de Inicio de Sesión</h2>
      <form>
        <label htmlFor="username">Nombre de Usuario:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="password">Contraseña:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="button" onClick={handleLogin}>
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

export default LoginComponent;

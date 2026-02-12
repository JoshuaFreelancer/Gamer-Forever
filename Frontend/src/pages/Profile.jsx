
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoginComponent from './Login';
import RegisterComponent from './Register';
import UserProfileImage from '../assets/images/perfil_de_usuario.png';
import '../assets/styles/App.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/user-profile');
        setUserData(response.data);
      } catch (error) {
        console.error('Error al obtener la información del usuario:', error.response.data);
      }
    };

    fetchData();
  }, []);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowRegister(false);
    // Navegar a la ruta /login
    navigate('/login');
  };

  const handleRegisterClick = () => {
    setShowLogin(false);
    setShowRegister(true);
    // Navegar a la ruta /register
    navigate('/register');
  };

  return (
    <div className="profile">
      <img src={UserProfileImage} alt="Imagen de perfil" className="profile-image" />
      <div className="profile-text">
        <span className="profile-link" onClick={handleLoginClick}>
          INICIAR SESIÓN
        </span>
        <span className="divider">|</span>
        <span className="profile-link" onClick={handleRegisterClick}>
          REGISTRARSE
        </span>
      </div>

      {showLogin && <LoginComponent />}
      {showRegister && <RegisterComponent />}
      
      {userData && (
        <div className="user-info">
          <p>Nombre de Usuario: {userData.username}</p>
          <p>Nombre: {userData.firstName}</p>
          <p>Apellido: {userData.lastName}</p>
          <p>Correo Electrónico: {userData.email}</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
import React, { useState, useEffect } from 'react';
import '../assets/styles/App.css';

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Realiza la solicitud a la API para obtener las categorías
    fetch("https://api.rawg.io/api/genres?key=f91db0b1d11143638d9547da8056c0b4")
      .then(response => response.json())
      .then(data => {
        // Guarda las primeras 6 categorías en el estado
        setCategories(data.results.slice(0, 6));
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="categories-list">
      <div className="categories-header">
        <h2 className="categories-title">Categorías</h2>
        <button className="see-all-button">Ver todo</button>
      </div>
      <div className="category-container">
        {categories.map(category => (
          <div key={category.id} className="category-item">
            <div className="category-image-wrapper">
              <img
                src={category.image_background} // URL de la imagen de la categoría
                alt={category.name}
                className="category-image"
              />
            </div>
            <div className="category-name-overlay">
              {category.name.toUpperCase()} {/* Mostrar el nombre en mayúsculas */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesList;

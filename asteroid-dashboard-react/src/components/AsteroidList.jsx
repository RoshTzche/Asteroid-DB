// src/components/AsteroidList.jsx
import React from 'react';
import useAsteroidStore from '../store';
// ¡Quitamos Framer Motion por ahora para simplificar!
import styles from './AsteroidList.module.css'; // ¡¡IMPORTANTE: Importamos nuestros estilos!!

function AsteroidList() {
  const { asteroids, selectedAsteroid, setSelectedAsteroid } = useAsteroidStore();

  if (asteroids.length === 0) {
    // ... (la parte de "cargando" se queda igual por ahora)
  }

  return (
    // Usamos nuestros nuevos estilos con la variable "styles"
    <div className={styles.listContainer}>
      <h2 className={styles.title}>Catálogo</h2>
      <ul className={styles.list}>
        {asteroids.map((asteroid) => (
          <li key={asteroid.identificador}>
            <button
              onClick={() => setSelectedAsteroid(asteroid)}
              // ¡Aquí está la magia! Combinamos clases
              className={`
                ${styles.listItem} 
                ${selectedAsteroid?.identificador === asteroid.identificador ? styles.selected : ''}
              `}
            >
              {asteroid.identificador}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AsteroidList;
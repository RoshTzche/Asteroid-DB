// src/components/AsteroidList.jsx
import React from 'react';
import useAsteroidStore from '../store';
import styles from './AsteroidList.module.css';

function AsteroidList() {
  const { asteroids, selectedAsteroid, setSelectedAsteroid } = useAsteroidStore();

  if (asteroids.length === 0) {
    return <div className={styles.loading}>Loading asteroids...</div>;
  }

  return (
    <div className={styles.listContainer}>
      <h2 className={styles.title}>Catalog</h2>
      <ul className={styles.list}>
        {asteroids.map((asteroid) => (
          <li key={asteroid.identificador}>
            <button
              onClick={() => setSelectedAsteroid(asteroid)}
              className={`
                ${styles.listItem} 
                ${selectedAsteroid?.identificador === asteroid.identificador ? styles.selected : ''}
              `}
            >
              <div className={styles.itemContent}>
                {/* Use full_name if available, otherwise fallback to identificador */}
                <span className={styles.itemName}>{asteroid.full_name || asteroid.identificador}</span>
                <span className={styles.itemDetails}>
                  {asteroid.diameter ? `Ø ${asteroid.diameter.toFixed(2)} km` : 'No diameter data'}
                </span>
              </div>
              { (asteroid.es_peligroso === true || asteroid.es_peligroso === 'Y') && <div className={styles.hazardousIndicator}></div> }
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AsteroidList;
// src/components/AsteroidList.jsx
import React from 'react';
import useAsteroidStore from '../store';
import styles from './AsteroidList.module.css';

function AsteroidList() {
  const { 
    asteroids, 
    selectedAsteroid, 
    setSelectedAsteroid, 
    searchTerm, 
    setSearchTerm,
    filter,
    setFilter
  } = useAsteroidStore();

  const filteredAsteroids = asteroids.filter(asteroid => {
    const nameMatch = (asteroid.full_name || asteroid.identificador)
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    const isPha = asteroid.es_peligroso === true || asteroid.es_peligroso === 'Y';
    const filterMatch = 
      filter === 'all' || 
      (filter === 'pha' && isPha) || 
      (filter === 'non-pha' && !isPha);

    return nameMatch && filterMatch;
  });

  if (asteroids.length === 0) {
    return <div className={styles.loading}>Loading asteroids...</div>;
  }

  return (
    <div className={styles.listContainer}>
      <h2 className={styles.title}>Catalog</h2>
      
      <div className={styles.controlsContainer}>
        <input 
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <div className={styles.filterTabs}>
          <button 
            onClick={() => setFilter('all')} 
            className={`${styles.tabButton} ${filter === 'all' ? styles.selected : ''}`}>
            All
          </button>
          <button 
            onClick={() => setFilter('pha')} 
            className={`${styles.tabButton} ${filter === 'pha' ? styles.selected : ''}`}>
            PHA
          </button>
          <button 
            onClick={() => setFilter('non-pha')} 
            className={`${styles.tabButton} ${filter === 'non-pha' ? styles.selected : ''}`}>
            Non-PHA
          </button>
        </div>
      </div>

      <ul className={styles.list}>
        {filteredAsteroids.map((asteroid) => {
          const isPha = asteroid.es_peligroso === true || asteroid.es_peligroso === 'Y';
          return (
            <li key={asteroid.identificador}>
              <button
                onClick={() => setSelectedAsteroid(asteroid)}
                className={`
                  ${styles.listItem} 
                  ${selectedAsteroid?.identificador === asteroid.identificador ? styles.selected : ''}
                `}
              >
                <div className={styles.itemContent}>
                  <span className={styles.itemName}>{asteroid.full_name || asteroid.identificador}</span>
                  <span className={styles.itemDetails}>
                    {asteroid.diameter ? `Ø ${asteroid.diameter.toFixed(2)} km` : 'No diameter data'}
                  </span>
                </div>
                { isPha ? 
                  <div className={styles.hazardousIndicator}></div> :
                  <div className={styles.safeIndicator}></div>
                }
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  );
}

export default AsteroidList;
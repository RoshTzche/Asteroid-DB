// src/components/AsteroidList.jsx
import React from 'react';
import useAsteroidStore from '../store';

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
    return <div className="loading">Loading asteroids...</div>;
  }

  return (
    <div className="listContainer">
      <h2 className="listTitle">Catalog</h2>
      
      <div className="controlsContainer">
        <input 
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="searchInput"
        />
        <div className="filterTabs">
          <button 
            onClick={() => setFilter('all')} 
            className={`tabButton ${filter === 'all' ? 'selected' : ''}`}>
            All
          </button>
          <button 
            onClick={() => setFilter('pha')} 
            className={`tabButton ${filter === 'pha' ? 'selected' : ''}`}>
            PHA
          </button>
          <button 
            onClick={() => setFilter('non-pha')} 
            className={`tabButton ${filter === 'non-pha' ? 'selected' : ''}`}>
            Non-PHA
          </button>
        </div>
      </div>

      <ul className="list">
        {filteredAsteroids.map((asteroid) => {
          const isPha = asteroid.es_peligroso === true || asteroid.es_peligroso === 'Y';
          return (
            <li key={asteroid.identificador}>
              <button
                onClick={() => setSelectedAsteroid(asteroid)}
                className={`listItem ${selectedAsteroid?.identificador === asteroid.identificador ? 'selected' : ''}`}
              >
                <div className="itemContent">
                  <span className="itemName">{asteroid.full_name || asteroid.identificador}</span>
                  <span className="itemDetails">
                    {asteroid.diameter ? `Ø ${asteroid.diameter.toFixed(2)} km` : 'No diameter data'}
                  </span>
                </div>
                { isPha ? 
                  <div className="hazardousIndicator"></div> :
                  <div className="safeIndicator"></div>
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
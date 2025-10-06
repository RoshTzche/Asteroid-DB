// src/components/AsteroidList.jsx
import React, { useState } from 'react';
import useAsteroidStore from '../store';

// Popup Component for filter explanations
function FilterInfoPopup({ onClose }) {
  return (
    <div className="infoPopupOverlay" onClick={onClose}>
      <div className="infoPopupContent" onClick={(e) => e.stopPropagation()}>
        <h3 className="infoPopupTitle">Filter Explanations</h3>
        <ul>
          <li><strong>Search by name:</strong> Filters the list based on the asteroid's name or identifier.</li>
          <li><strong>PHA/Non-PHA:</strong> Filters for Potentially Hazardous Asteroids.</li>
          <li><strong>Name Type:</strong> Filters asteroids that have a proper full name versus just a provisional designation.</li>
          <li><strong>Diameter:</strong> Filters asteroids by their estimated size (in kilometers).
            <ul>
              <li><small>&lt; 1 km: Smaller objects, very common.</small></li>
              <li><small>1-10 km: Medium-sized asteroids.</small></li>
              <li><small>&gt; 10 km: Large objects, less common and of significant interest.</small></li>
            </ul>
          </li>
        </ul>
        <button onClick={onClose} className="infoPopupCloseButton">Close</button>
      </div>
    </div>
  );
}

function AsteroidList() {
  const { 
    asteroids, 
    selectedAsteroid, 
    setSelectedAsteroid, 
    searchTerm, 
    setSearchTerm,
    filter,
    setFilter,
    nameFilter,
    setNameFilter,
    diameterFilter,
    setDiameterFilter
  } = useAsteroidStore();

  const [showInfoPopup, setShowInfoPopup] = useState(false);

  const filteredAsteroids = asteroids.filter(asteroid => {
    // Search Term Filter
    const nameMatch = (asteroid.full_name || asteroid.identificador)
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    // PHA Filter
    const isPha = asteroid.es_peligroso === true || asteroid.es_peligroso === 'Y';
    const filterMatch = 
      filter === 'all' || 
      (filter === 'pha' && isPha) || 
      (filter === 'non-pha' && !isPha);

    // Full Name Filter
    const hasFullName = asteroid.full_name && !/^\d/.test(asteroid.full_name);
    const nameFilterMatch = 
      nameFilter === 'all' ||
      (nameFilter === 'with-name' && hasFullName);

    // Diameter Filter
    const diameter = asteroid.diameter || 0;
    const diameterFilterMatch =
      diameterFilter === 'all' ||
      (diameterFilter === 'small' && diameter < 1) ||
      (diameterFilter === 'medium' && diameter >= 1 && diameter <= 10) ||
      (diameterFilter === 'large' && diameter > 10);

    return nameMatch && filterMatch && nameFilterMatch && diameterFilterMatch;
  });

  if (asteroids.length === 0) {
    return <div className="loading">Loading asteroids...</div>;
  }

  return (
    <div className="listContainer">
      {showInfoPopup && <FilterInfoPopup onClose={() => setShowInfoPopup(false)} />}
<a href="https://neo-sphere-llub.vercel.app/" className='returnButton'>
  Return to NEOSphere
</a>      <div className="listTitleContainer">
          <h2 className="listTitle">Asteroid Catalog</h2>
        <button className="suggestionButton" onClick={() => setShowInfoPopup(true)}>?</button>
      </div>
      
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
            Hazarodus
          </button>
          <button 
            onClick={() => setFilter('non-pha')} 
            className={`tabButton ${filter === 'non-pha' ? 'selected' : ''}`}>
            Non Hazardous
          </button>
        </div>
        {/* New Filters */}
        <div className="filterGrid">
          <div className="filterGroup">
            <label className="filterLabel">Name Type</label>
            <select className="filterSelect" value={nameFilter} onChange={(e) => setNameFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="with-name">With Full Name</option>
            </select>
          </div>
          <div className="filterGroup">
            <label className="filterLabel">Diameter (km)</label>
            <select className="filterSelect" value={diameterFilter} onChange={(e) => setDiameterFilter(e.target.value)}>
              <option value="all">All Sizes</option>
              <option value="small">&lt; 1 km</option>
              <option value="medium">1 - 10 km</option>
              <option value="large">&gt; 10 km</option>
            </select>
          </div>
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
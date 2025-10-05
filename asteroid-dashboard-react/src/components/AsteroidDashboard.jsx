// src/components/AsteroidDashboard.jsx
import React, { useEffect } from 'react';
import useAsteroidStore from '../store';
import AsteroidList from './AsteroidList';
import AsteroidDetails from './AsteroidDetails';

function AsteroidDashboard() {
  const { setAsteroids } = useAsteroidStore();

  useEffect(() => {
    fetch('/catalogo_asteroides_web.json')
      .then(res => res.json())
      .then(data => {
        data.sort((a, b) => (a.identificador || '').localeCompare(b.identificador || ''));
        setAsteroids(data);
      })
      .catch(err => console.error("Error loading asteroid data:", err));
  }, [setAsteroids]);

  return (
    <div className="dashboardContainer">
      <div className="listColumn">
        <AsteroidList />
      </div>
      <div className="detailsColumn">
        <AsteroidDetails />
      </div>
    </div>
  );
}

export default AsteroidDashboard;
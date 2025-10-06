// src/components/AsteroidDashboard.jsx
import React, { useEffect } from 'react';
import useAsteroidStore from '../store';
import AsteroidList from './AsteroidList';
import AsteroidDetails from './AsteroidDetails';

function AsteroidDashboard() {
  const { setAsteroids } = useAsteroidStore();

  useEffect(() => {
    // Construct the correct path for the fetch request
    const jsonUrl = `${import.meta.env.BASE_URL}catalogo_asteroides_web.json`;

    fetch(jsonUrl)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Network response was not ok: ${res.statusText}`);
        }
        return res.json();
      })
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
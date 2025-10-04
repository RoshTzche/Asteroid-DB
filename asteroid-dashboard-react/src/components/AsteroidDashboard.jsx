// src/components/AsteroidDashboard.jsx
import React, { useEffect } from 'react';
import useAsteroidStore from '../store';
import AsteroidList from './AsteroidList';
import AsteroidDetails from './AsteroidDetails';
import styles from './AsteroidDashboard.module.css'; // ¡Importamos!

function AsteroidDashboard() {
  const { setAsteroids } = useAsteroidStore();

  useEffect(() => {
    fetch('/catalogo_asteroides_web.json')
      .then(res => res.json())
      .then(data => {
        data.sort((a, b) => (a.identificador || '').localeCompare(b.identificador || ''));
        setAsteroids(data);
      })
      .catch(err => console.error("¡Oh no, Senpai! Error al cargar:", err));
  }, [setAsteroids]);

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.listColumn}>
        <AsteroidList />
      </div>
      <div className={styles.detailsColumn}>
        <AsteroidDetails />
      </div>
    </div>
  );
}

export default AsteroidDashboard;
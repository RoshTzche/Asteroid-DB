// src/components/AsteroidDetails.jsx
import React, { useState, useEffect } from 'react';
import useAsteroidStore from '../store';
import OrbitSimulator from './OrbitSimulator'; // Import OrbitSimulator here
import styles from './AsteroidDetails.module.css';

const DataCard = ({ label, value }) => (
  <div className={styles.dataCard}>
    <div className={styles.dataLabel}>{label}</div>
    <div className={styles.dataValue}>{value}</div>
  </div>
);

function AsteroidDetails() {
  const { selectedAsteroid } = useAsteroidStore();
  
  // This component now has its own state to control the view
  const [showSimulator, setShowSimulator] = useState(false);

  // This effect ensures that whenever a new asteroid is selected,
  // we exit the simulator and show its details.
  useEffect(() => {
    if (selectedAsteroid) {
      setShowSimulator(false);
    }
  }, [selectedAsteroid]);

  // If showSimulator is true, render the simulator component
  if (showSimulator) {
    return <OrbitSimulator />;
  }

  // If no asteroid is selected, show the welcome message
  if (!selectedAsteroid) {
    return (
      <div className={`${styles.detailsPanel} ${styles.welcomeMessage}`}>
        <div>
          <h1 className={styles.welcomeTitle}>Welcome</h1>
          <p className={styles.welcomeSubtitle}>Select an asteroid to view its details</p>
        </div>
      </div>
    );
  }

  // Otherwise, show the asteroid details
  const isHazardous = selectedAsteroid.es_peligroso === true || selectedAsteroid.es_peligroso === 'Y';

  return (
    <div className={styles.detailsPanel}>
      <h1 className={styles.title}>{selectedAsteroid.full_name || selectedAsteroid.identificador}</h1>
      <span className={`${styles.tag} ${isHazardous ? styles.hazardous : styles.safe}`}>
        {isHazardous ? 'Potentially Hazardous' : 'Not Hazardous'}
      </span>

      <div className={styles.dataGrid}>
        <DataCard label="Estimated Diameter" value={selectedAsteroid.diameter ? `${selectedAsteroid.diameter.toFixed(2)} km` : 'N/A'} />
        <DataCard label="Absolute Magnitude" value={selectedAsteroid.magnitud_absoluta ? selectedAsteroid.magnitud_absoluta.toFixed(2) : 'N/A'} />
        <DataCard label="Orbital Period" value={selectedAsteroid.periodo_orbital_anios ? `${selectedAsteroid.periodo_orbital_anios.toFixed(2)} years` : 'N/A'} />
        <DataCard label="Albedo" value={selectedAsteroid.albedo ? selectedAsteroid.albedo : 'N/A'} />
      </div>

      <div className={styles.buttonContainer}>
        {/* This button now controls the local state */}
        <button className={styles.simulatorButton} onClick={() => setShowSimulator(true)}>
          Show Orbit Simulator
        </button>
      </div>
    </div>
  );
}

export default AsteroidDetails;
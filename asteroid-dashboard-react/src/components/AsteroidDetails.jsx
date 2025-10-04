// src/components/AsteroidDetails.jsx
import React from 'react';
import useAsteroidStore from '../store';
import styles from './AsteroidDetails.module.css'; // ¡Importamos los nuevos estilos!

// Hacemos que la tarjeta sea un componente aquí mismo para que sea más fácil
const DataCard = ({ label, value }) => (
  <div className={styles.dataCard}>
    <div className={styles.dataLabel}>{label}</div>
    <div className={styles.dataValue}>{value}</div>
  </div>
);

function AsteroidDetails() {
  const { selectedAsteroid } = useAsteroidStore();

  if (!selectedAsteroid) {
    return (
      <div className={`${styles.detailsPanel} ${styles.welcomeMessage}`}>
        <div>
          <h1 className={styles.welcomeTitle}>¡Bienvenido, Senpai!</h1>
          <p className={styles.welcomeSubtitle}>Selecciona un asteroide para descubrir sus secretos ✨</p>
        </div>
      </div>
    );
  }

  const isHazardous = selectedAsteroid.es_peligroso === true || selectedAsteroid.es_peligroso === 'Y';

  return (
    <div className={styles.detailsPanel}>
      <h1 className={styles.title}>{selectedAsteroid.identificador}</h1>
      <span className={`${styles.tag} ${isHazardous ? styles.hazardous : styles.safe}`}>
        {isHazardous ? 'Potencialmente Peligroso' : 'No Peligroso'}
      </span>

      <div className={styles.dataGrid}>
        <DataCard label="Diámetro Estimado" value={selectedAsteroid.diameter ? `${selectedAsteroid.diameter.toFixed(2)} km` : 'N/A'} />
        <DataCard label="Magnitud Absoluta" value={selectedAsteroid.magnitud_absoluta ? selectedAsteroid.magnitud_absoluta.toFixed(2) : 'N/A'} />
        <DataCard label="Período Orbital" value={selectedAsteroid.periodo_orbital_anios ? `${selectedAsteroid.periodo_orbital_anios.toFixed(2)} años` : 'N/A'} />
        <DataCard label="Albedo" value={selectedAsteroid.albedo ? selectedAsteroid.albedo : 'N/A'} />
      </div>
    </div>
  );
}

export default AsteroidDetails;
// src/components/AsteroidDetails.jsx
import React, { useState, useEffect } from 'react';
import useAsteroidStore from '../store';
import OrbitSimulator from './OrbitSimulator'; // Import OrbitSimulator here

const DataCard = ({ label, value }) => (
  <div className="dataCard">
    <div className="dataLabel">{label}</div>
    <div className="dataValue">{value}</div>
  </div>
);

function AsteroidDetails() {
  const { selectedAsteroid } = useAsteroidStore();
  
  const [showSimulator, setShowSimulator] = useState(false);

  useEffect(() => {
    if (selectedAsteroid) {
      setShowSimulator(false);
    }
  }, [selectedAsteroid]);

  if (showSimulator) {
    return <OrbitSimulator />;
  }

  if (!selectedAsteroid) {
    return (
      <div className="detailsPanel welcomeMessage">
        <div>
          <h1 className="welcomeTitle">Welcome</h1>
          <p className="welcomeSubtitle">Select an asteroid to view its details</p>
        </div>
      </div>
    );
  }

  const isHazardous = selectedAsteroid.es_peligroso === true || selectedAsteroid.es_peligroso === 'Y';

  return (
    <div className="detailsPanel">
      <h1 className="detailsTitle">{selectedAsteroid.full_name || selectedAsteroid.identificador}</h1>
      <span className={`tag ${isHazardous ? 'hazardous' : 'safe'}`}>
        {isHazardous ? 'Potentially Hazardous' : 'Not Hazardous'}
      </span>

      <div className="dataGrid">
        <DataCard label="Estimated Diameter" value={selectedAsteroid.diameter ? `${selectedAsteroid.diameter.toFixed(2)} km` : 'N/A'} />
        <DataCard label="Absolute Magnitude" value={selectedAsteroid.magnitud_absoluta ? selectedAsteroid.magnitud_absoluta.toFixed(2) : 'N/A'} />
        <DataCard label="Orbital Period" value={selectedAsteroid.periodo_orbital_anios ? `${selectedAsteroid.periodo_orbital_anios.toFixed(2)} years` : 'N/A'} />
        <DataCard label="Albedo" value={selectedAsteroid.albedo ? selectedAsteroid.albedo : 'N/A'} />
      </div>

      <div className="buttonContainer">
        <button className="simulatorButton" onClick={() => setShowSimulator(true)}>
          Show Orbit Simulator
        </button>
      </div>
    </div>
  );
}

export default AsteroidDetails;
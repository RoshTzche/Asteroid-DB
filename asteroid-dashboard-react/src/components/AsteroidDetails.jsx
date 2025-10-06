// src/components/AsteroidDetails.jsx
import React, { useState, useEffect } from 'react';
import useAsteroidStore from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import OrbitSimulator from './OrbitSimulator';
import AsteroidAIInsights from './AsteroidAIInsights';
// --- Reusable Popup Component ---
function InfoPopup({ content, onClose }) {
  if (!content) return null;

  return (
    <motion.div
      className="infoPopupOverlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="infoPopupContent"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="infoPopupTitle">{content.title}</h3>
        <p className="infoPopupDescription">{content.description}</p>
        <button onClick={onClose} className="infoPopupCloseButton">Got it</button>
      </motion.div>
    </motion.div>
  );
}

// --- Reusable Module Button Component ---
const ModuleButton = ({ label, value, onClick, unit = '' }) => (
  <motion.button
    className="moduleButton"
    onClick={onClick}
    whileTap={{ scale: 0.95 }}
  >
    <div className="dataLabel">{label}</div>
    <div className="dataValue">
      {value}
      {unit && <span className="dataUnit"> {unit}</span>}
    </div>
  </motion.button>
);

// --- Popup Content Definitions ---
const POPUP_DEFINITIONS = {
  MOID: {
    title: 'Minimum Orbit Intersection Distance (MOID)',
    description: 'MOID is the minimum distance between the orbits of two bodies. In this case, it represents the closest the asteroid\'s orbit comes to Earth\'s orbit. A smaller value indicates a higher potential for a close approach. It is measured in Astronomical Units (AU).',
  },
  PERIHELION: {
    title: 'Perihelion Distance (q)',
    description: 'This is the point in the asteroid\'s orbit where it is closest to the Sun. A small perihelion means the asteroid travels deep into the inner solar system. It is measured in Astronomical Units (AU).',
  },
  APHELION: {
    title: 'Aphelion Distance (ad)',
    description: 'This is the point in the asteroid\'s orbit where it is farthest from the Sun. The aphelion distance defines the outer boundary of the asteroid\'s journey. It is measured in Astronomical Units (AU).',
  },
  DIAMETER: {
    title: 'Estimated Diameter',
    description: 'This is the estimated diameter of the asteroid, measured in kilometers. The size is often estimated based on its brightness (absolute magnitude) and reflectivity (albedo), as direct measurements are rare.',
  },
  ROTATION: {
    title: 'Rotation Period',
    description: 'This is the time it takes for the asteroid to complete one full rotation on its axis. It gives us an idea of the "day" length on the asteroid and is measured in hours.',
  },
  MAGNITUDE: {
    title: 'Absolute Magnitude (H)',
    description: 'Absolute Magnitude is a measure of an asteroid\'s intrinsic brightness. It\'s the brightness it would have if it were viewed from a standard distance. A smaller number means a brighter (and likely larger) object.',
  },
  ALBEDO: {
    title: 'Albedo',
    description: 'Albedo measures the reflectivity of the asteroid\'s surface. It is a value between 0 (perfectly black, absorbs all light) and 1 (perfectly white, reflects all light). It helps in estimating the asteroid\'s size and composition.',
  },
  HAZARD: {
    title: 'Potentially Hazardous Asteroid (PHA)',
    description: 'An asteroid is classified as "Potentially Hazardous" if its Minimum Orbit Intersection Distance (MOID) with Earth is less than 0.05 AU and its absolute magnitude (H) is 22.0 or brighter. This classification does not mean an impact is imminent, only that it warrants careful monitoring.',
  },
};

function AsteroidDetails() {
  const { selectedAsteroid } = useAsteroidStore();
  const [popupContent, setPopupContent] = useState(null);
  const [showSimulator, setShowSimulator] = useState(false);
  const [simulatorKey, setSimulatorKey] = useState(0);

  useEffect(() => {
    if (selectedAsteroid) {
      setShowSimulator(false);
      setSimulatorKey((prev) => prev + 1);
    }
  }, [selectedAsteroid]);

  if (showSimulator) {
    return (
      <div className="simulatorContainer">
        <OrbitSimulator 
          key={simulatorKey} 
          onReturn={() => setShowSimulator(false)}
        />
      </div>
    );
  }

  if (!selectedAsteroid) {
    return (
      <div className="detailsPanel welcomeMessage">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="welcomeSubtitle">Select an asteroid to see its data</p>
        </motion.div>
      </div>
    );
  }

  const isHazardous = selectedAsteroid.es_peligroso === true || selectedAsteroid.es_peligroso === 'Y';

  return (
    <>
      <AnimatePresence>
        {popupContent && <InfoPopup content={popupContent} onClose={() => setPopupContent(null)} />}
      </AnimatePresence>
      
      <motion.div 
        key={selectedAsteroid.identificador}
        className="detailsPanel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="detailsHeader">
          <h1 className="detailsTitle">{selectedAsteroid.full_name || selectedAsteroid.identificador}</h1>
          <button className="simulatorButton" onClick={() => setShowSimulator(true)}>
            Show Orbit Simulator
          </button>
        </div>
        <AsteroidAIInsights className="AI" asteroid={selectedAsteroid} />

        <div className='moduleGroup'>
          <h2 className="moduleGroupTitle">Distances & Orbit</h2>
          <p className='infoDetails'>(Click for more info.)</p>
          <div className="moduleGrid">
            <ModuleButton label="Min. Orbit Distance" value={selectedAsteroid.distancia_min_orbita_au?.toFixed(4) || 'N/A'} unit="AU" onClick={() => setPopupContent(POPUP_DEFINITIONS.MOID)} />
            <ModuleButton label="Perihelion (Closest to Sun)" value={selectedAsteroid.q?.toFixed(3) || 'N/A'} unit="AU" onClick={() => setPopupContent(POPUP_DEFINITIONS.PERIHELION)} />
            <ModuleButton label="Aphelion (Farthest from Sun)" value={selectedAsteroid.ad?.toFixed(3) || 'N/A'} unit="AU" onClick={() => setPopupContent(POPUP_DEFINITIONS.APHELION)} />
            <ModuleButton label="Orbital Period" value={selectedAsteroid.periodo_orbital_anios?.toFixed(2) || 'N/A'} unit="years" />
          </div>
        </div>

        <div className="moduleGroup">
          <h2 className="moduleGroupTitle">Physical Characteristics</h2>
          <div className="moduleGrid">
            <ModuleButton label="Estimated Diameter" value={selectedAsteroid.diameter?.toFixed(2) || 'N/A'} unit="km" onClick={() => setPopupContent(POPUP_DEFINITIONS.DIAMETER)} />
            <ModuleButton label="Rotation Period" value={selectedAsteroid.periodo_rotacion_horas?.toFixed(2) || 'N/A'} unit="hours" onClick={() => setPopupContent(POPUP_DEFINITIONS.ROTATION)} />
          </div>
        </div>
        
        <div className="moduleGroup2">
          <h2 className="moduleGroupTitle">Luminance & Hazard</h2>
          <div className="moduleGrid">
            <ModuleButton label="Absolute Magnitude" value={selectedAsteroid.magnitud_absoluta?.toFixed(2) || 'N/A'} onClick={() => setPopupContent(POPUP_DEFINITIONS.MAGNITUDE)} />
            <ModuleButton label="Albedo (Reflectivity)" value={selectedAsteroid.albedo || 'N/A'} onClick={() => setPopupContent(POPUP_DEFINITIONS.ALBEDO)} />
            <ModuleButton label="Hazard Level" value={isHazardous ? 'PHA' : 'Non-PHA'} onClick={() => setPopupContent(POPUP_DEFINITIONS.HAZARD)} />
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default AsteroidDetails;
// src/components/AsteroidDetails.jsx
import React from 'react';
import useAsteroidStore from '../store';
import { motion, AnimatePresence } from 'framer-motion';

// Creamos una "tarjeta" reutilizable para cada dato, ¡así nuestro código es más limpio!
const DataCard = ({ label, value }) => (
  <motion.div
    className="bg-gray-900 bg-opacity-60 p-4 rounded-lg shadow-lg"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <div className="text-sm text-gray-400 uppercase tracking-wider">{label}</div>
    <div className="text-2xl font-bold text-accent-cyan">{value}</div>
  </motion.div>
);

function AsteroidDetails() {
  const { selectedAsteroid } = useAsteroidStore();

  // Si no hemos seleccionado nada, mostramos un mensaje de bienvenida
  if (!selectedAsteroid) {
    return (
      <div className="flex items-center justify-center h-full text-center p-8 bg-space-light rounded-lg">
        <div>
          <h1 className="text-4xl font-bold text-primary-yellow">¡Bienvenido, Senpai!</h1>
          <p className="mt-4 text-xl text-gray-300">Selecciona un asteroide de la lista para descubrir sus secretos cósmicos ✨</p>
        </div>
      </div>
    );
  }
  
  const isHazardous = selectedAsteroid.es_peligroso === true || selectedAsteroid.es_peligroso === 'Y';

  return (
    <div className="p-8 bg-space-light rounded-lg h-full overflow-y-auto">
      {/* AnimatePresence es el truco mágico para animar la entrada y salida de elementos */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedAsteroid.identificador} // ¡La "key" le dice a React que es un nuevo elemento!
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-5xl font-bold mb-2 text-primary-yellow">{selectedAsteroid.identificador}</h1>
          <span className={`px-3 py-1 text-sm font-bold rounded-full ${isHazardous ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
            {isHazardous ? 'Potencialmente Peligroso' : 'No Peligroso'}
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <DataCard label="Diámetro Estimado" value={selectedAsteroid.diameter ? `${selectedAsteroid.diameter.toFixed(2)} km` : 'N/A'} />
            <DataCard label="Magnitud Absoluta" value={selectedAsteroid.magnitud_absoluta ? selectedAsteroid.magnitud_absoluta.toFixed(2) : 'N/A'} />
            <DataCard label="Período Orbital" value={selectedAsteroid.periodo_orbital_anios ? `${selectedAsteroid.periodo_orbital_anios.toFixed(2)} años` : 'N/A'} />
            <DataCard label="Albedo" value={selectedAsteroid.albedo ? selectedAsteroid.albedo : 'N/A'} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default AsteroidDetails;
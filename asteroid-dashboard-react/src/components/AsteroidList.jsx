// src/components/AsteroidList.jsx
import React from 'react';
import useAsteroidStore from '../store';
import { motion } from 'framer-motion';

function AsteroidList() {
  const { asteroids, selectedAsteroid, setSelectedAsteroid } = useAsteroidStore();

  // Si aún no hay asteroides, mostramos un mensajito
  if (asteroids.length === 0) {
    return (
      <div className="bg-space-light h-full rounded-lg p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-4 border-b-2 border-gray-600 pb-2 text-primary-yellow">Cargando...</h2>
        <p className="text-gray-400">Buscando asteroides en el cosmos...</p>
      </div>
    )
  }

  return (
    <div className="bg-space-light h-full rounded-lg p-4 flex flex-col">
      <h2 className="text-2xl font-bold mb-4 border-b-2 border-gray-600 pb-2 text-primary-yellow">Catálogo</h2>
      <ul className="overflow-y-auto flex-grow pr-2">
        {asteroids.map((asteroid) => (
          <motion.li key={asteroid.identificador} whileHover={{ scale: 1.03 }}>
            <button
              onClick={() => setSelectedAsteroid(asteroid)}
              className={`w-full text-left p-3 my-1 rounded-md transition-all text-lg
                ${selectedAsteroid?.identificador === asteroid.identificador
                  ? 'bg-primary-yellow text-space-dark font-bold shadow-lg'
                  : 'bg-slate-700 hover:bg-slate-600'
                }`}
            >
              {asteroid.identificador}
            </button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

export default AsteroidList;
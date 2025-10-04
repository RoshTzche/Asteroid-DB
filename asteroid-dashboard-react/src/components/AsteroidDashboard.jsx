// src/components/AsteroidDashboard.jsx
import React, { useEffect } from 'react';
import useAsteroidStore from '../store';
import AsteroidList from './AsteroidList';
import AsteroidDetails from './AsteroidDetails';

function AsteroidDashboard() {
  const { setAsteroids } = useAsteroidStore();

  useEffect(() => {
    // ¡Buscamos los datos de nuestro archivo JSON!
    // Senpai, asegúrate de poner tu archivo `catalogo_asteroides_web.json`
    // en la carpeta `public` de tu proyecto de React.
    fetch('/catalogo_asteroides_web.json')
      .then(res => res.json())
      .then(data => {
        // Ordenamos los datos por nombre para que se vea bonito
        data.sort((a, b) => (a.identificador || '').localeCompare(b.identificador || ''));
        setAsteroids(data);
      })
      .catch(err => console.error("¡Oh no, Senpai! Hubo un error al cargar el JSON:", err));
  }, [setAsteroids]);

  return (
    <div className="flex h-[calc(100vh-100px)] gap-4">
      <div className="w-1/3 max-w-sm">
        <AsteroidList />
      </div>
      <div className="w-2/3 flex-grow">
        <AsteroidDetails />
      </div>
    </div>
  );
}

export default AsteroidDashboard;
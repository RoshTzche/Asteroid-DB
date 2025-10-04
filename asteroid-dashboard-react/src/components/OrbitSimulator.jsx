// src/components/OrbitSimulator.jsx
import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Line, Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const API_URL = 'http://127.0.0.1:5001';

// --- Componentes Reutilizables ---

// Un cuerpo celeste genérico (sol, planeta, asteroide)
function CelestialBody({ position, size, color, name }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshBasicMaterial color={color} />
      <Text
        position={[0, size + 0.05, 0]} // Un poquito arriba del cuerpo
        fontSize={0.1}
        color="white"
        anchorX="center"
      >
        {name}
      </Text>
    </mesh>
  );
}

// La escena principal donde vive nuestro sistema solar
function Scene() {
  const [orbits, setOrbits] = useState({});
  const [positions, setPositions] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const orbitsRes = await fetch(`${API_URL}/api/orbits`);
        if (!orbitsRes.ok) throw new Error('Error al cargar órbitas');
        const orbitsData = await orbitsRes.json();
        setOrbits(orbitsData);

        const updatePositions = async () => {
          try {
            const posRes = await fetch(`${API_URL}/api/positions`);
            if (!posRes.ok) throw new Error('Error al cargar posiciones');
            const posData = await posRes.json();
            setPositions(posData);
            setError(null);
          } catch (e) {
            setError('No se pudo conectar con el servidor. ¿Está asf.py corriendo?');
          }
        };

        updatePositions();
        const interval = setInterval(updatePositions, 5000); // Actualizamos cada 5 seg
        return () => clearInterval(interval);
      } catch (e) {
        setError('Error de red inicial. Revisa el servidor y recarga la página.');
      }
    }
    fetchData();
  }, []);

  return (
    <>
      {/* El Sol brillante en el centro */}
      <pointLight position={[0, 0, 0]} color="#facc15" intensity={3} distance={100} />
      <CelestialBody position={[0, 0, 0]} size={0.15} color="#facc15" name="Sol" />

      {/* Dibujamos las líneas de las órbitas */}
      {Object.entries(orbits).map(([name, points]) => (
        <Line
          key={name}
          points={points.map(p => new THREE.Vector3(p[0], p[1], 0))}
          color={name === 'Tierra' ? '#06b6d4' : '#3f3f46'}
          lineWidth={name === 'Tierra' ? 1.5 : 1}
        />
      ))}
      
      {/* Dibujamos los cuerpos celestes que se mueven */}
      {Object.entries(positions).map(([name, pos]) => (
        <CelestialBody
          key={name}
          position={[pos.x, pos.y, 0]}
          size={name === 'Tierra' ? 0.05 : 0.02}
          color={name === 'Tierra' ? '#06b6d4' : '#f97316'}
          name={name}
        />
      ))}

      {/* Mensaje de error si algo sale mal */}
      {error && <Text position={[-3, 3, 0]} color="red" fontSize={0.2} anchorX="left">{error}</Text>}
    </>
  );
}

// El componente principal que exportamos
function OrbitSimulator() {
    return (
        <div className="h-[calc(100vh-100px)] bg-black rounded-lg border-2 border-space-light">
            {/* Suspense es como un "cargando..." para nuestra escena 3D */}
            <Suspense fallback={<div className="text-white">Cargando simulador...</div>}>
                <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
                    <Scene />
                    {/* ¡Controles para mover la cámara con el ratón! */}
                    <OrbitControls />
                </Canvas>
            </Suspense>
        </div>
    );
}

export default OrbitSimulator;
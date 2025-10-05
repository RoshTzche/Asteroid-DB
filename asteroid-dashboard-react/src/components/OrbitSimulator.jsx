// src/components/OrbitSimulator.jsx
import React, { useState, useEffect, Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { Line, Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// This is now the INITIAL state for the planet colors
const INITIAL_PLANET_COLORS = {
  "Mercury": "#a0a0a0",
  "Venus": "#d4a06a",
  "Earth": "#06b6d4",
  "Mars": "#ff4d4d",
  "Jupiter": "#ffc300",
  "Saturn": "#e6d5a8",
  "Uranus": "#a8e6e6",
  "Neptune": "#6a82d4",
};

// Background component for space
function SpaceBackground() {
  const texture = useLoader(THREE.TextureLoader, '/8k_stars_milky_way.jpg');
  return (
    <mesh>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

function Sun() {
  const sunTexture = useLoader(THREE.TextureLoader, '/2k_sun.jpg');
  return (
    <>
      <mesh>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshBasicMaterial map={sunTexture} />
        <Text position={[0, 0.3, 0]} fontSize={0.2} color="white" anchorX="center">Sun</Text>
      </mesh>
      <pointLight position={[0, 0, 0]} color="var(--color-primary)" intensity={3} distance={100} />
    </>
  );
}

// Scene now accepts the full color objects as props
function Scene({ planetColors, asteroidColor }) {
  const [orbits, setOrbits] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrbits() {
      try {
        const response = await fetch('/orbitas_3d.json');
        if (!response.ok) throw new Error('orbitas_3d.json not found.');
        const data = await response.json();
        setOrbits(data);
      } catch (e) {
        setError(e.message);
      }
    }
    fetchOrbits();
  }, []);

  return (
    <>
      <SpaceBackground />
      <Sun />

      {Object.values(orbits).map((orbitData) => {
        if (!orbitData.coordenadas) return null;
        
        // Check if the orbit belongs to a planet using the passed colors object
        const isPlanet = planetColors.hasOwnProperty(orbitData.nombre);
        // Assign color dynamically
        const color = isPlanet ? planetColors[orbitData.nombre] : asteroidColor;

        return (
          <Line
            key={orbitData.nombre}
            points={orbitData.coordenadas.map(p => new THREE.Vector3(p[0], p[1], p[2]))}
            color={color}
            lineWidth={isPlanet ? 1.5 : 1}
          />
        );
      })}
      {error && <Text position={[0, 0, 0]} color="var(--color-danger)" fontSize={0.2} anchorX="center">{error}</Text>}
    </>
  );
}

function OrbitSimulator({ onReturn }) {
  const [planetColors, setPlanetColors] = useState(INITIAL_PLANET_COLORS);
  const [asteroidColor, setAsteroidColor] = useState('#475569');

  // Handler to update a specific planet's color
  const handlePlanetColorChange = (planetName, newColor) => {
    setPlanetColors(prevColors => ({
      ...prevColors,
      [planetName]: newColor,
    }));
  };

  // Handler to refresh colors to initial state
  const handleRefresh = () => {
    setPlanetColors(INITIAL_PLANET_COLORS);
    setAsteroidColor('#475569');
  };

  return (
    <div className="simulatorWrapper">
      <div className="controlsPanel">
        {/* Asteroid control on the left */}
        <div className="controlItem">
          <label htmlFor="asteroidColor">Asteroids</label>
          <input
            type="color"
            id="asteroidColor"
            value={asteroidColor}
            onChange={(e) => setAsteroidColor(e.target.value)}
          />
        </div>
        
        {/* Vertical divider */}
        <div style={{ width: '1px', height: '60px', backgroundColor: 'var(--color-border)' }}></div>

        {/* Planet grid on the right */}
        <div className="planetsGrid">
          {Object.entries(planetColors).map(([name, color]) => (
            <div className="controlItem" key={name}>
              <label htmlFor={`${name}-color`}>{name}</label>
              <input
                type="color"
                id={`${name}-color`}
                value={color}
                onChange={(e) => handlePlanetColorChange(name, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom right buttons */}
      <div className="simulatorButtons">
        <button className="simulatorActionButton refreshButton" onClick={handleRefresh}>
          ↻ Refresh
        </button>
        <button className="simulatorActionButton refreshButton" onClick={onReturn}>
          ← Return
        </button>
        <button className='simulatorActionButton refreshButton'>
          Hide Orbits
        </button>
      </div>


      <Suspense fallback={<div className="text-white">Loading Simulator...</div>}>
        <Canvas camera={{ position: [20, -20, 20], fov: 75, near: 0.1, far: 1000 }}>
          <Scene planetColors={planetColors} asteroidColor={asteroidColor} />
          <OrbitControls minDistance={1} maxDistance={80} />
        </Canvas>
      </Suspense>
    </div>
  );
}

export default OrbitSimulator;
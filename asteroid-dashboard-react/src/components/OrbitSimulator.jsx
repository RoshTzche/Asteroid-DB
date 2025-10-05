// src/components/OrbitSimulator.jsx
import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Line, Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
// No local CSS import is needed anymore

function Sun() {
  return (
    <>
      <pointLight position={[0, 0, 0]} color="var(--color-primary)" intensity={3} distance={100} />
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshBasicMaterial color="var(--color-primary)" />
        <Text position={[0, 0.2, 0]} fontSize={0.15} color="white" anchorX="center">Sun</Text>
      </mesh>
    </>
  );
}

// The Scene now accepts colors as props
function Scene({ earthColor, asteroidColor }) {
  const [orbits, setOrbits] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrbits() {
      try {
        const response = await fetch('/orbitas_3d.json');
        if (!response.ok) {
          throw new Error('orbitas_3d.json not found.');
        }
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
      <Sun />
      <gridHelper args={[20, 20]} rotation={[Math.PI / 2, 0, 0]} />

      {Object.values(orbits).map((orbitData) => {
        if (!orbitData.coordenadas) return null;
        return (
          <Line
            key={orbitData.nombre}
            points={orbitData.coordenadas.map(p => new THREE.Vector3(p[0], p[1], p[2]))}
            // Use the colors from state props
            color={orbitData.nombre === 'Tierra' ? earthColor : asteroidColor}
            lineWidth={orbitData.nombre === 'Tierra' ? 1.5 : 1}
          />
        );
      })}

      {error && <Text position={[0, 0, 0]} color="var(--color-danger)" fontSize={0.2} anchorX="center">{error}</Text>}
    </>
  );
}

// Main component with state and UI controls
function OrbitSimulator() {
  const [earthColor, setEarthColor] = useState('#06b6d4');
  const [asteroidColor, setAsteroidColor] = useState('#475569');

  return (
    // This div now uses the global class and has no inline styles. Its size is controlled by the CSS.
    <div className="simulatorWrapper">
      {/* Controls Panel */}
      <div className="controlsPanel">
        <div className="controlItem">
          <label htmlFor="earthColor">Earth Orbit</label>
          <input
            type="color"
            id="earthColor"
            value={earthColor}
            onChange={(e) => setEarthColor(e.target.value)}
          />
        </div>
        <div className="controlItem">
          <label htmlFor="asteroidColor">Asteroid Orbits</label>
          <input
            type="color"
            id="asteroidColor"
            value={asteroidColor}
            onChange={(e) => setAsteroidColor(e.target.value)}
          />
        </div>
      </div>

      {/* 3D Canvas with corrected camera for 3D view */}
      <Suspense fallback={<div className="text-white">Loading Simulator...</div>}>
        <Canvas camera={{ position: [5, -5, 5], fov: 75, near: 0.1, far: 1000 }}>
          <Scene earthColor={earthColor} asteroidColor={asteroidColor} />
          <OrbitControls />
        </Canvas>
      </Suspense>
    </div>
  );
}

export default OrbitSimulator;
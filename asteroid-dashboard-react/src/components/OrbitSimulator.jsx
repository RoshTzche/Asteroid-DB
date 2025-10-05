// src/components/OrbitSimulator.jsx
import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Line, Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const API_URL = 'http://127.0.0.1:5001';

function CelestialBody({ position, size, color, name }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[size, 64, 64]} />
      <meshBasicMaterial color={color} />
      <Text
        position={[0, size + 0.05, 0]}
        fontSize={0.1}
        color="white"
        anchorX="center"
      >
        {name}
      </Text>
    </mesh>
  );
}

function Scene() {
  const [orbits, setOrbits] = useState({});
  const [positions, setPositions] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const orbitsRes = await fetch(`${API_URL}/api/orbits`);
        if (!orbitsRes.ok) throw new Error('Failed to load orbits');
        const orbitsData = await orbitsRes.json();
        setOrbits(orbitsData);

        const updatePositions = async () => {
          try {
            const posRes = await fetch(`${API_URL}/api/positions`);
            if (!posRes.ok) throw new Error('Failed to load positions');
            const posData = await posRes.json();
            setPositions(posData);
            setError(null);
          } catch (e) {
            setError('Could not connect to the server. Is \'asf.py\' running?');
          }
        };

        updatePositions();
        const interval = setInterval(updatePositions, 5000);
        return () => clearInterval(interval);
      } catch (e) {
        setError('Initial network error. Check the server and reload the page.');
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <pointLight position={[0, 0, 0]} color="#facc15" intensity={3} distance={100} />
      <CelestialBody position={[0, 0, 0]} size={0.15} color="#facc15" name="Sun" />

      {Object.entries(orbits).map(([name, points]) => (
        <Line
          key={name}
          points={points.map(p => new THREE.Vector3(p[0], p[1], 0))}
          color={name === 'Tierra' ? '#06b6d4' : '#3f3f46'}
          lineWidth={name === 'Tierra' ? 1.5 : 1}
        />
      ))}
      
      {Object.entries(positions).map(([name, pos]) => (
        <CelestialBody
          key={name}
          position={[pos.x, pos.y, 0]}
          size={name === 'Earth' ? 0.05 : 0.02}
          color={name === 'Earth' ? '#06b6d4' : '#f97316'}
          name={name}
        />
      ))}

      {error && <Text position={[-3, 3, 0]} color="red" fontSize={0.2} anchorX="left">{error}</Text>}
    </>
  );
}

function OrbitSimulator() {
    return (
          <div className="absolute top-5 right-5 w-full h-full border-2 border-white rounded-lg overflow-hidden z-10">  
            <Suspense fallback={<div className="text-white">Loading simulator...</div>}>
                <Canvas camera={{ position: [0, 0, 8], fov: 75, near: 0.1, far: 1000}}>
                    <Scene />
                    <OrbitControls />
                </Canvas>
            </Suspense>
        </div>
    );
}

export default OrbitSimulator;
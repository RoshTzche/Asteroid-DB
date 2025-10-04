// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import AsteroidDashboard from './components/AsteroidDashboard';
import OrbitSimulator from './components/OrbitSimulator';

function App() {
  return (
    <Router>
      <div className="bg-space-dark text-gray-200 min-h-screen flex flex-col">
        <nav className="bg-space-light p-4 shadow-lg flex justify-center space-x-8">
          <NavLink to="/" className={({ isActive }) => `text-xl font-bold transition-colors ${isActive ? 'text-primary-yellow' : 'hover:text-primary-yellow'}`}>
            Dashboard
          </NavLink>
          <NavLink to="/simulator" className={({ isActive }) => `text-xl font-bold transition-colors ${isActive ? 'text-primary-yellow' : 'hover:text-primary-yellow'}`}>
            Simulador de Órbita
          </NavLink>
        </nav>
        <main className="flex-grow p-4 overflow-hidden">
          <Routes>
            <Route path="/" element={<AsteroidDashboard />} />
            <Route path="/simulator" element={<OrbitSimulator />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
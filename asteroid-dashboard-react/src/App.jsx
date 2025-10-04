// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import AsteroidDashboard from './components/AsteroidDashboard';
import OrbitSimulator from './components/OrbitSimulator';
import styles from './App.module.css'; // ¡Nuestro último import!

function App() {
  return (
    <Router>
      <div className={styles.appContainer}>
        <nav className={styles.nav}>
          <NavLink to="/" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            Dashboard
          </NavLink>
          <NavLink to="/simulator" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            Simulador de Órbita
          </NavLink>
        </nav>
        <main className={styles.mainContent}>
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
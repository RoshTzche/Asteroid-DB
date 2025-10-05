// src/App.jsx
import React from 'react';
import AsteroidDashboard from './components/AsteroidDashboard';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.appContainer}>
      <main className={styles.mainContent}>
        <AsteroidDashboard />
      </main>
    </div>
  );
}

export default App;
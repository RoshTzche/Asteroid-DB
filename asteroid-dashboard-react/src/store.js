// src/store.js
import { create } from 'zustand';

// ¡Nuestra pequeña tienda de datos!
const useAsteroidStore = create((set) => ({
  asteroids: [], // Aquí guardaremos la lista completa de asteroides
  selectedAsteroid: null, // Y aquí el que seleccionemos
  setAsteroids: (data) => set({ asteroids: data }),
  setSelectedAsteroid: (asteroid) => set({ selectedAsteroid: asteroid }),
}));

export default useAsteroidStore;

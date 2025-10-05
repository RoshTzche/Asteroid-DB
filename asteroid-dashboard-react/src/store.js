// src/store.js
import { create } from 'zustand';

const useAsteroidStore = create((set) => ({
  asteroids: [],
  selectedAsteroid: null,
  searchTerm: '',
  filter: 'all',
  diameterFilter: 'all', // New state for diameter
  periodFilter: 'all',   // New state for orbital period
  
  setAsteroids: (data) => set({ asteroids: data }),
  setSelectedAsteroid: (asteroid) => set({ selectedAsteroid: asteroid }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setFilter: (filterType) => set({ filter: filterType }),
  setDiameterFilter: (size) => set({ diameterFilter: size }),
  setPeriodFilter: (duration) => set({ periodFilter: duration }),
}));

export default useAsteroidStore;
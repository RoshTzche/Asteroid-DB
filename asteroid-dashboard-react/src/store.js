// src/store.js
import { create } from 'zustand';

const useAsteroidStore = create((set) => ({
  asteroids: [],
  selectedAsteroid: null,
  searchTerm: '', // State for the search input
  filter: 'all',   // State for the filter: 'all', 'pha', 'non-pha'
  
  setAsteroids: (data) => set({ asteroids: data }),
  setSelectedAsteroid: (asteroid) => set({ selectedAsteroid: asteroid }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setFilter: (filterType) => set({ filter: filterType }),
}));

export default useAsteroidStore;
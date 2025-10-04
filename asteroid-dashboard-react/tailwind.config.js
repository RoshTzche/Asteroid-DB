// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'space-dark': '#0f172a',    // Un negro azulado
        'space-light': '#1e293b',   // Un gris oscuro
        'primary-yellow': '#facc15', // Nuestro amarillo vibrante
        'accent-cyan': '#06b6d4',
      }
    },
  },
  plugins: [],
}

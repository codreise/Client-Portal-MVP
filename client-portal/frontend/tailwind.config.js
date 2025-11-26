/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
  colors: {
    primary: "#646cff",       
    secondary: "#61dafb",     
    accent: "#ff9800",        
    bg: "#f4f6fb",          
    card: "#ffffff",          
    text: "#333333",
    error: "#dc2626",
  },
}
},
  plugins: [],
}
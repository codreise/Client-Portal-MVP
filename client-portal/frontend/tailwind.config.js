/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purpleLight: "#F3E8FF",   // фон (світло‑фіолетовий)
          purpleDark: "#4C1D95",    // заголовки, текст
          peach: "#FDBA74",         // кнопки (Create, Log out)
          peachHover: "#FB923C",    // hover для кнопок
        },
      },
    },
  },
  plugins: [],
}
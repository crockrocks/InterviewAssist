/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        light: {
          background: '#ffffff',
          text: '#1a202c',
        },
        dark: {
          background: '#1a202c',
          text: '#ffffff',
        },
      },
    },
  },
  plugins: [],
};

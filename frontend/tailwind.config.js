/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'customPrimary': '#287E62',
        'customSecondary': '#1A9170',
        'customDark': '#080F0F',
        'customLight': '#D81159'
      },

      fontFamily: {
        sans: ['Source Code Pro', 'monospace'], // Define your sans-serif font stack
      }

    }
  },
  plugins: [],
}
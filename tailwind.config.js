/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        latin: ['Inter', 'Noto Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        arabic: ['"Noto Naskh Arabic"', 'serif'],
        bengali: ['"Noto Sans Bengali"', 'sans-serif']
      }
    }
  },
  plugins: []
}
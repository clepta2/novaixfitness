/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        title: ['Montserrat', 'sans-serif'],
      },
      colors: {
        novaix: {
          bg: '#12161A',
          surface: '#1E232A',
          hover: '#2A2F38',
          border: '#333333',
          primary: '#CCFF00',
          secondary: '#FF6B35',
          success: '#00E676',
          attention: '#FFD600',
          error: '#FF1744',
        }
      }
    },
  },
  plugins: [],
}

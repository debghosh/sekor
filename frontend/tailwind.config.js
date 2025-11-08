/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#DC143C',
        'text-dark': '#242424',
        'text-medium': '#6B6B6B',
        'text-light': '#8B8B8B',
        border: '#E6E6E6',
        'bg-white': '#FFFFFF',
        'bg-light': '#FAFAFA',
        hover: '#F5F5F5',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

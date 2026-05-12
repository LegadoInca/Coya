/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        keyframes: {
          'flag-float': {
            '0%, 100%': { transform: 'rotate(-8deg) scale(1.05)' },
            '50%': { transform: 'rotate(8deg) scale(0.95)' },
          },
        },
        animation: {
          'flag-float': 'flag-float 2s ease-in-out infinite',
        },
      },
    },
    plugins: [],
  }

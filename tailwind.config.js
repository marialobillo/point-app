/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#1C1B22',
        surface: '#26242E',
        ink: '#EDEAE5',
        'ink-muted': '#9C97A8',
        amber: '#D9B872',
        mint: '#8FC9B4',
      },
      keyframes: {
        phraseIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'phrase-in': 'phraseIn 200ms ease-out',
      },
    },
  },
  plugins: [],
}


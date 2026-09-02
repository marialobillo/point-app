/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
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
    },
  },
  plugins: [],
}


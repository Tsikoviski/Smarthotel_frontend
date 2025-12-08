export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5DADE2',
        secondary: '#F4D03F',
        teal: {
          DEFAULT: '#5DADE2',
          dark: '#3498DB',
          light: '#85C1E9',
        },
        gold: {
          DEFAULT: '#F4D03F',
          dark: '#F1C40F',
          light: '#F9E79F',
        }
      }
    },
  },
  plugins: [],
}

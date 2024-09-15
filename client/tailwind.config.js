/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens:{
        phone:'800px',
        smallDevice:'510px'
      },
      backgroundColor:{
        primaryBlueBgColor:'#1256AF',
        primaryBlueHoverBgColor:'#3A7DD1'
      },
      borderColor:{
        primaryBorderColor:'#4C4942'
      }
    },
  },
  plugins: [],
}


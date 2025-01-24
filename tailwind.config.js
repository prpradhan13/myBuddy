/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        ubuntu: ['Ubuntu', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },

      colors: {
        MainBackgroundColor: "#1a1a1a",
        SecondaryBackgroundColor: "#2d2d2d",
        PrimaryTextColor: "#FFFFFF",
        SecondaryTextColor: "#D3D3D3",
        MainButtonColor: "#FFFF33",
        SecondaryButtonColor: "#00F9FF",
        ButtonLoadingColor: "#caca4c"
      }
    },
  },
  plugins: [],
}

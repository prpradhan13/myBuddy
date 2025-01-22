/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        MainBackgroundColor: "#1e1e1e",
        SecondaryBackgroundColor: "#1C1C1C",
        PrimaryTextColor: "#FFFFFF",
        SecondaryTextColor: "#D3D3D3",
        MainButtonColor: "#FFFF33",
        SecondaryButtonColor: "#39FF14",
        ButtonLoadingColor: "#caca4c"
      }
    },
  },
  plugins: [],
}

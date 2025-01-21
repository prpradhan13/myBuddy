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
        SecondaryBackgroundColor: "#2a2a2a",
        PrimaryTextColor: "#ededed",
        SecondaryTextColor: "#c8c8c8",
        BorderColor: "#eee",
      }
    },
  },
  plugins: [],
}

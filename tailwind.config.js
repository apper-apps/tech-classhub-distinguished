/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f5f7",
          100: "#dbe7ed", 
          200: "#b7d0db",
          300: "#8bb3c2",
          400: "#5a91a3",
          500: "#2E5266",
          600: "#294a5c",
          700: "#24414e",
          800: "#1f3742",
          900: "#1b2f37"
        },
        secondary: {
          50: "#f2f5f6",
          100: "#e5eaec",
          200: "#ccd5d9",
          300: "#a6b4bc",
          400: "#7d939e",
          500: "#6E8898",
          600: "#5d7586",
          700: "#4e6270",
          800: "#40525c",
          900: "#374549"
        },
        accent: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0", 
          300: "#86efac",
          400: "#4ade80",
          500: "#52B788",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d"
        },
        success: "#52B788",
        warning: "#F4A261",
        error: "#E76F51",
        info: "#4ECDC4"
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
}
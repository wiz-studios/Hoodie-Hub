/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E4D2CC",
        secondary: "#EA9950",
        accent: "#9B84C3",
        background: "#222021",
        foreground: "#FFFFFF", // 👈 Add this line
      },
      borderColor: {
        border: 'var(--border)', 
      },
    },
  },
  plugins: [],
};

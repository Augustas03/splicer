/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  corePlugins: {
    preflight: false, // Disable Tailwind's reset
  },
  theme: {
    extend: {
      fontFamily: {
        parkinsans: ["Parkinsans", "sans-serif"], // Add Parkinsans font
      },
      animation: {
        blob: "blob 7s infinite", // Add blob animation
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(300px, 0px) scale(2)",
          },
          "33%": {
            transform: "translate(500px, -350px) scale(3)",
          },
          "66%": {
            transform: "translate(-500px, -200px) scale(2)",
          },
          "100%": {
            transform: "translate(300px, 0px) scale(2)",
          },
        },
      },
    },
  },
  plugins: [],
};
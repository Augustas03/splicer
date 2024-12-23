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
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      animation: {
        blob: "blob 7s infinite", // Add blob animation
        "text-slide-2":
          "text-slide-2 5s cubic-bezier(0.83, 0, 0.17, 1) infinite",
        "text-slide-3":
          "text-slide-3 7.5s cubic-bezier(0.83, 0, 0.17, 1) infinite",
        "text-slide-4":
          "text-slide-4 10s cubic-bezier(0.83, 0, 0.17, 1) infinite",
        "text-slide-5":
          "text-slide-5 12.5s cubic-bezier(0.83, 0, 0.17, 1) infinite",
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
        "text-slide-2": {
          "0%": {
            transform: "translateY(0%)",
          },
          "100%": {
            transform: "translateY(-50%)", // Moves 50% upwards
          },
        },
        "text-slide-3": {
          "0%": {
            transform: "translateY(0%)",
          },
          "33%": {
            transform: "translateY(-25%)", // Moves 25% upwards
          },
          "66%": {
            transform: "translateY(-50%)", // Moves 50% upwards
          },
          "100%": {
            transform: "translateY(-75%)", // Moves 75% upwards
          },
        },
        "text-slide-4": {
          "0%": {
            transform: "translateY(0%)",
          },
          "50%": {
            transform: "translateY(-50%)",
          },
          "100%": {
            transform: "translateY(-100%)",
          },
        },
        "text-slide-5": {
          "0%, 20%": {
            transform: "translateY(0%)",
          },
          "40%, 60%": {
            transform: "translateY(-40%)",
          },
          "80%, 100%": {
            transform: "translateY(-80%)",
          },
        },
      },
    },
  },
  plugins: [],
};
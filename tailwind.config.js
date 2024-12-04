/** @type {import('tailwindcss').Config */
  module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    corePlugins: {
      preflight: false, //disable Tailwind's reset
    },
    theme: {
      extend: {},
    },
    plugins: [],
  }
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",  // Use the app folder path if you're using the `app` directory in Next.js 13+
    "./pages/**/*.{js,ts,jsx,tsx}",  // Include the pages directory if it's not in the `app` directory
    "./components/**/*.{js,ts,jsx,tsx}",  // Include components if they are in a separate folder
  ],
  theme: {
    extend: {
      screens: {
        'xs': '300px', // Add custom small screen size
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [require("daisyui")],
  darkTheme: "dark",
  daisyui: {
    themes: [

      {
        torito: {

          primary: "#1A3B77",
          "primary-content": "#F8FAFC",
          secondary: "#284B94",
          "secondary-content": "#F8FAFC",
          accent: "#F7C840",
          "accent-content": "#3A3A3A",


          "base-100": "#F2F4F6",
          "base-200": "#FFFFFF",
          "base-300": "#F7F7F8",
          "base-content": "#3A3A3A",


          info: "#60A5FA",
          success: "#34D399",
          warning: "#FBBF24",
          error: "#F87171",


          "--rounded-btn": "0.75rem",
        },
      },

      {
        dark: {
          primary: "#FFD700",
          "primary-content": "#1E3A8A",
          secondary: "#FCD34D",
          "secondary-content": "#1E40AF",
          accent: "#FBBF24",
          "accent-content": "#1E3A8A",
          neutral: "#1E40AF",
          "neutral-content": "#FFD700",
          "base-100": "#1E3A8A",
          "base-200": "#1E40AF",
          "base-300": "#1D4ED8",
          "base-content": "#F8FAFC",
          info: "#60A5FA",
          success: "#34D399",
          warning: "#FBBF24",
          error: "#F87171",

          "--rounded-btn": "9999rem",
          ".tooltip": { "--tooltip-tail": "6px" },
          ".link": { textUnderlineOffset: "2px" },
          ".link:hover": { opacity: "80%" },
        },
      },
    ],
  },
  theme: {
    extend: {
      boxShadow: {
        center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
};

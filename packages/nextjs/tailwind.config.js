/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  darkTheme: "dark",
  // DaisyUI theme colors
  daisyui: {
    themes: [
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

          ".tooltip": {
            "--tooltip-tail": "6px",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
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

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          bg: "#090d16",
          panel: "#0e131f",
          panel2: "#121826",
          border: "#1c2333",
          border2: "#242c40",
        },
        accent: {
          DEFAULT: "#f0a020",
          soft: "#f7b74a",
        },
        up: "#22c55e",
        down: "#ef4444",
        muted: "#8892a6",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        xl: "0.85rem",
        "2xl": "1.1rem",
      },
      boxShadow: {
        panel: "0 1px 0 0 rgba(255,255,255,0.02) inset",
      },
    },
  },
  plugins: [],
};

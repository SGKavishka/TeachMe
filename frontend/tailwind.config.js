/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#111827",
        brand: {
          50: "#eefdf7",
          100: "#d5faec",
          500: "#10b981",
          600: "#059669",
          700: "#047857"
        },
        coral: {
          500: "#f97363"
        },
        cobalt: {
          500: "#2563eb"
        }
      },
      boxShadow: {
        soft: "0 18px 55px rgba(15, 23, 42, 0.10)"
      }
    }
  },
  plugins: []
};


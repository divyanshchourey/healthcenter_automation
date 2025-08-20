import type { Config } from 'tailwindcss'

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,jsx,js}"
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px"
      }
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0077B6",
          foreground: "#FFFFFF"
        },
        secondary: {
          DEFAULT: "#90E0EF",
          foreground: "#1F2937"
        },
        background: "#FFFFFF",
        muted: "#F8F9FA",
        text: "#1F2937"
      },
      boxShadow: {
        soft: "0 4px 12px rgba(0, 0, 0, 0.06)"
      },
      fontFamily: {
        inter: ["Inter", "ui-sans-serif", "system-ui", "-apple-system"]
      }
    }
  },
  plugins: []
} satisfies Config




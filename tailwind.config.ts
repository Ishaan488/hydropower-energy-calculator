import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        hydro: {
          navy: "#0a0f1a",
          slate: "#111827",
          "slate-light": "#1f2937",
          blue: "#2563eb",
          cyan: "#0891b2",
          teal: "#0d9488",
          "blue-glow": "#3b82f6",
          "cyan-glow": "#06b6d4",
          surface: "#151c2c",
          border: "#1e293b",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "flow-particle": "flow-particle 3s linear infinite",
        "fade-in": "fade-in 0.4s ease-out forwards",
        "slide-up": "slide-up 0.4s ease-out forwards",
      },
      keyframes: {
        "flow-particle": {
          "0%": { transform: "translateX(0%)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      boxShadow: {
        "card": "0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.4)",
        "subtle": "0 1px 2px rgba(0,0,0,0.2)",
      },
    },
  },
  plugins: [],
};
export default config;

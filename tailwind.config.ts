import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.{css,module.css}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        background: "#050510",
        foreground: "#ffffff",
        accent: {
          violet: "#7c3aed",
          blue: "#2563eb",
          emerald: "#34d399",
        },
      },
      animation: {
        "fade-slide-up": "fadeSlideUp 0.9s ease both",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

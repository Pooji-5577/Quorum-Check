import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        ink: "#111114",
        lilac: "#f04a23",
        blush: "#f6f7fb",
        butter: "#fff4e8",
        peach: "#ffd8c6",
        mist: "#fbf7f2",
      },
      boxShadow: {
        soft: "0 22px 70px rgba(23, 23, 31, 0.10)",
        float: "0 16px 45px rgba(240, 74, 35, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;

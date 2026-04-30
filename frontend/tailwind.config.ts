import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./hooks/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        paper: "#E8E8E8",
        muted: "#9A9A9A",
        accent: "#7B8CFF",
        panel: "#111111",
        line: "#2A2A2A"
      },
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["Inter", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;

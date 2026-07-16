import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-2": "var(--bg-2)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        "surface-3": "var(--surface-3)",
        "surface-hover": "var(--surface-hover)",
        ink: "var(--text)",
        "ink-2": "var(--text-2)",
        "ink-3": "var(--text-3)",
        "ink-muted": "var(--text-muted)",
        violet: "var(--violet)",
        "violet-bright": "var(--violet-bright)",
        "violet-deep": "var(--violet-deep)",
        cyan: "var(--cyan)",
        "series-1": "var(--series-1)",
        "series-2": "var(--series-2)",
        "series-3": "var(--series-3)",
        "series-4": "var(--series-4)",
        "series-5": "var(--series-5)",
        line: "var(--hairline)",
        "line-2": "var(--hairline-2)",
        "line-strong": "var(--border-strong)",
        "wash-1": "var(--wash-1)",
        "wash-2": "var(--wash-2)",
      },
      borderRadius: {
        card: "var(--radius)",
        "card-sm": "var(--radius-sm)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      maxWidth: {
        content: "1400px",
      },
    },
  },
  plugins: [],
};
export default config;

"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const opts = [
    {
      key: "dark" as const,
      label: "Escuro",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      ),
    },
    {
      key: "light" as const,
      label: "Claro",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex items-center gap-1 rounded-full border border-line bg-wash-1 p-1">
      {opts.map((o) => {
        const active = theme === o.key;
        return (
          <button
            key={o.key}
            onClick={() => setTheme(o.key)}
            aria-pressed={active}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-2.5 py-1.5 text-[12px] font-medium transition ${
              active
                ? "bg-wash-2 text-ink shadow-sm"
                : "text-ink-3 hover:text-ink-2"
            }`}
          >
            <span className={active ? "text-[var(--violet-bright)]" : ""}>{o.icon}</span>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getPalette, type Palette, type ThemeName } from "@/lib/theme";

interface ThemeState {
  theme: ThemeName;
  palette: Palette;
  toggle: () => void;
  setTheme: (t: ThemeName) => void;
}

const Ctx = createContext<ThemeState | null>(null);

export function useTheme(): ThemeState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}

/** Inline script (runs before paint) that sets data-theme from storage — no flash. */
export const themeInitScript = `try{var t=localStorage.getItem('theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}`;

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("dark");

  // Sync React state with the attribute the inline script already applied.
  useEffect(() => {
    const attr = document.documentElement.getAttribute("data-theme");
    if (attr === "light" || attr === "dark") setThemeState(attr);
  }, []);

  const setTheme = useCallback((t: ThemeName) => {
    setThemeState(t);
    const root = document.documentElement;
    root.classList.add("theme-anim");
    root.setAttribute("data-theme", t);
    try {
      localStorage.setItem("theme", t);
    } catch {}
    window.setTimeout(() => root.classList.remove("theme-anim"), 400);
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const value = useMemo<ThemeState>(
    () => ({ theme, palette: getPalette(theme), toggle, setTheme }),
    [theme, toggle, setTheme]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

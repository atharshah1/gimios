import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { defaultTheme, gymThemes, lightTheme, GymTheme } from "../theme/tokens";

type ThemeContextType = {
  theme: GymTheme;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType>({ theme: defaultTheme, toggleDarkMode: () => undefined });

export function ThemeProvider({ gymSlug, children }: { gymSlug?: string; children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);

  const toggleDarkMode = useCallback(() => setIsDark((prev) => !prev), []);

  const theme = useMemo(() => {
    const base = gymSlug ? gymThemes[gymSlug] ?? defaultTheme : defaultTheme;
    if (!isDark) return { ...lightTheme, accent: base.accent };
    return base;
  }, [gymSlug, isDark]);

  return <ThemeContext.Provider value={{ theme, toggleDarkMode }}>{children}</ThemeContext.Provider>;
}

export function useGymTheme() {
  return useContext(ThemeContext).theme;
}

export function useThemeToggle() {
  return useContext(ThemeContext).toggleDarkMode;
}

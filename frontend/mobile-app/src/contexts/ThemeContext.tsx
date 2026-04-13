import React, { createContext, useContext, useMemo } from "react";
import { defaultTheme, gymThemes, GymTheme } from "../theme/tokens";

type ThemeContextType = {
  theme: GymTheme;
};

const ThemeContext = createContext<ThemeContextType>({ theme: defaultTheme });

export function ThemeProvider({ gymSlug, children }: { gymSlug?: string; children: React.ReactNode }) {
  const theme = useMemo(() => (gymSlug ? gymThemes[gymSlug] ?? defaultTheme : defaultTheme), [gymSlug]);

  return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>;
}

export function useGymTheme() {
  return useContext(ThemeContext).theme;
}

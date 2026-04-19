export type GymTheme = {
  background: string;
  panel: string;
  panelSoft: string;
  text: string;
  muted: string;
  accent: string;
  danger: string;
  border: string;
  isDark: boolean;
};

export const defaultTheme: GymTheme = {
  background: "#0F172A",
  panel: "#1E293B",
  panelSoft: "#243247",
  text: "#F8FAFC",
  muted: "#94A3B8",
  accent: "#6366F1",
  danger: "#EF4444",
  border: "#334155",
  isDark: true,
};

export const lightTheme: GymTheme = {
  background: "#F1F5F9",
  panel: "#FFFFFF",
  panelSoft: "#F8FAFC",
  text: "#0F172A",
  muted: "#64748B",
  accent: "#6366F1",
  danger: "#EF4444",
  border: "#E2E8F0",
  isDark: false,
};

export const gymThemes: Record<string, GymTheme> = {
  "apex-athletics": defaultTheme,
  "fitme-studio": {
    ...defaultTheme,
    accent: "#22E075",
    panel: "#101514",
    panelSoft: "#18221F",
    isDark: true,
  },
};

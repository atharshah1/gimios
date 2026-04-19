export type GymTheme = {
  background: string;
  panel: string;
  panelSoft: string;
  text: string;
  muted: string;
  accent: string;
  danger: string;
  border: string;
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
};

export const gymThemes: Record<string, GymTheme> = {
  "apex-athletics": defaultTheme,
  "fitme-studio": {
    ...defaultTheme,
    accent: "#22E075",
    panel: "#101514",
    panelSoft: "#18221F",
  },
};

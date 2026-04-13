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
  background: "#050706",
  panel: "#0E1211",
  panelSoft: "#151A18",
  text: "#F6F8F7",
  muted: "#95A29C",
  accent: "#8BFF2A",
  danger: "#FF6E5A",
  border: "#1E2722",
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

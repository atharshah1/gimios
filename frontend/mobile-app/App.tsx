import React from "react";
import { RoleProvider, useRole } from "./src/contexts/RoleContext";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import { AppNavigator } from "./src/navigation/AppNavigator";

function AppShell() {
  const { gymSlug } = useRole();
  return (
    <ThemeProvider gymSlug={gymSlug ?? undefined}>
      <AppNavigator />
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <RoleProvider>
      <AppShell />
    </RoleProvider>
  );
}

import React from "react";
import { OpsProvider } from "./src/contexts/OpsContext";
import { RoleProvider, useRole } from "./src/contexts/RoleContext";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import { AppNavigator } from "./src/navigation/AppNavigator";

function AppShell() {
  const { gymSlug } = useRole();
  return (
    <ThemeProvider gymSlug={gymSlug ?? undefined}>
      <OpsProvider>
        <AppNavigator />
      </OpsProvider>
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

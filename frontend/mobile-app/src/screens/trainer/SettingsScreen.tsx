import React from "react";
import { Button } from "react-native";
import { Card } from "../../components/Card";
import { ScreenShell } from "../../components/ScreenShell";
import { useRole } from "../../contexts/RoleContext";

export function SettingsScreen() {
  const { devSwitchRole } = useRole();
  return (
    <ScreenShell title="Settings">
      <Card title="Profile & Tenant Theme" subtitle="Theme resolved from gym branding profile">
        <Button title="Dev: Switch to Member" onPress={() => devSwitchRole("member")} />
      </Card>
    </ScreenShell>
  );
}

import React from "react";
import { Button } from "react-native";
import { Card } from "../../components/Card";
import { ScreenShell } from "../../components/ScreenShell";
import { useRole } from "../../contexts/RoleContext";

export function ProfileScreen() {
  const { devSwitchRole } = useRole();

  return (
    <ScreenShell title="Profile">
      <Card title="Mike Ryan" subtitle="Pro Member since 2022">
        <Button title="Dev: Switch to Trainer" onPress={() => devSwitchRole("trainer")} />
      </Card>
    </ScreenShell>
  );
}

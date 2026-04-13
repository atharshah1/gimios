import React from "react";
import { StateView } from "../../components/StateView";
import { Card } from "../../components/Card";
import { ScreenShell } from "../../components/ScreenShell";

export function SessionDetailsScreen() {
  return (
    <ScreenShell title="Session Details">
      <Card title="Sarah Jenkins" subtitle="09:00 - 10:00 · Weight Room">
        <StateView title="Session in progress" description="Timer: 00:45:22 · Workout phase 2 is active." />
      </Card>
    </ScreenShell>
  );
}

import React from "react";
import { Card } from "../../components/Card";
import { MetricGrid } from "../../components/MetricGrid";
import { ScreenShell } from "../../components/ScreenShell";

export function LiveWorkoutScreen() {
  return (
    <ScreenShell title="Live Workout">
      <Card title="Full Body Shred" subtitle="Session in progress">
        <MetricGrid
          metrics={[
            { label: "Set", value: "1 / 3", accent: true },
            { label: "Reps", value: "12" },
            { label: "Weight", value: "45kg" },
            { label: "Rest", value: "00:45" },
          ]}
        />
      </Card>
    </ScreenShell>
  );
}

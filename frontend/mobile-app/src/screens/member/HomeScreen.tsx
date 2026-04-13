import React from "react";
import { Card } from "../../components/Card";
import { MetricGrid } from "../../components/MetricGrid";
import { ScreenShell } from "../../components/ScreenShell";

export function HomeScreen() {
  return (
    <ScreenShell title="Member Home">
      <Card title="Daily Tasks" subtitle="Almost done">
        <MetricGrid
          metrics={[
            { label: "Steps", value: "8.2k", accent: true },
            { label: "Calories", value: "1,240" },
            { label: "Protein", value: "85g" },
            { label: "Streak", value: "7 days" },
          ]}
        />
      </Card>
    </ScreenShell>
  );
}

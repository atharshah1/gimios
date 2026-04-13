import React from "react";
import { Card } from "../../components/Card";
import { MetricGrid } from "../../components/MetricGrid";
import { ScreenShell } from "../../components/ScreenShell";

export function ClientProfileScreen() {
  return (
    <ScreenShell title="Client Profile">
      <Card title="Sarah Jenkins" subtitle="Personal Training · 10 Pack">
        <MetricGrid
          metrics={[
            { label: "Sessions", value: "12" },
            { label: "Weight", value: "-4kg", accent: true },
            { label: "Adherence", value: "85%" },
            { label: "Status", value: "Active" },
          ]}
        />
      </Card>
    </ScreenShell>
  );
}

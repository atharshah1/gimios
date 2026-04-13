import React from "react";
import { Card } from "../../components/Card";
import { MetricGrid } from "../../components/MetricGrid";
import { ScreenShell } from "../../components/ScreenShell";

export function MembershipScreen() {
  return (
    <ScreenShell title="Membership">
      <Card title="Pro Member" subtitle="Billed monthly">
        <MetricGrid
          metrics={[
            { label: "Price", value: "$29.99", accent: true },
            { label: "Classes", value: "Unlimited" },
            { label: "Analytics", value: "Advanced" },
            { label: "Coaching", value: "1-on-1" },
          ]}
        />
      </Card>
    </ScreenShell>
  );
}

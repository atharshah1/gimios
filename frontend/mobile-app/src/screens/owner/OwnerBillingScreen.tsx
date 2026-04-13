import React from "react";
import { Card } from "../../components/Card";
import { MetricGrid } from "../../components/MetricGrid";
import { ScreenShell } from "../../components/ScreenShell";

export function OwnerBillingScreen() {
  return (
    <ScreenShell title="Billing / Subscription">
      <Card title="Razorpay Subscription" subtitle="₹15,000 / month">
        <MetricGrid
          metrics={[
            { label: "Plan", value: "Pro Gym", accent: true },
            { label: "Status", value: "Active" },
            { label: "Trial", value: "15 days" },
            { label: "Due", value: "Apr 30" },
          ]}
        />
      </Card>
    </ScreenShell>
  );
}

import React from "react";
import { Card } from "../../components/Card";
import { MetricGrid } from "../../components/MetricGrid";
import { StateView } from "../../components/StateView";
import { ScreenShell } from "../../components/ScreenShell";

export function BillingScreen() {
  const paymentFailed = true;

  return (
    <ScreenShell title="Billing & Invoices">
      {paymentFailed ? (
        <StateView
          title="Payment failed"
          description="Last invoice collection failed. Retry or update payment method."
          actionLabel="Retry Charge"
        />
      ) : null}
      <Card title="Invoices" subtitle="Current month">
        <MetricGrid
          metrics={[
            { label: "Revenue", value: "₹4,850", accent: true },
            { label: "Outstanding", value: "₹350" },
            { label: "Paid", value: "12" },
            { label: "Pending", value: "3" },
          ]}
        />
      </Card>
    </ScreenShell>
  );
}

import React from "react";
import { Card } from "../../components/Card";
import { MetricGrid } from "../../components/MetricGrid";
import { ScreenShell } from "../../components/ScreenShell";

export function HrmsScreen() {
  return (
    <ScreenShell title="HRMS Hub">
      <Card title="Trainer Workspace" subtitle="Attendance + payroll">
        <MetricGrid
          metrics={[
            { label: "Time Logged", value: "32.5h", accent: true },
            { label: "Leave", value: "14d" },
            { label: "Approvals", value: "2" },
            { label: "Policy Quiz", value: "Due" },
          ]}
        />
      </Card>
    </ScreenShell>
  );
}

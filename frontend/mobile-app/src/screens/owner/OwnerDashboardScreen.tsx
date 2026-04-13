import React from "react";
import { Card } from "../../components/Card";
import { MetricGrid } from "../../components/MetricGrid";
import { ScreenShell } from "../../components/ScreenShell";
import { useAttendance } from "../../hooks/useAttendance";
import { useRoster } from "../../hooks/useRoster";
import { useSlots } from "../../hooks/useSlots";

export function OwnerDashboardScreen() {
  const { trainers, members } = useRoster();
  const { slots } = useSlots();
  const { attendance } = useAttendance();

  return (
    <ScreenShell title="Owner Dashboard">
      <Card title="Operations Snapshot" subtitle="Live linked flow metrics">
        <MetricGrid
          metrics={[
            { label: "Trainers", value: String(trainers.length), accent: true },
            { label: "Members", value: String(members.length) },
            { label: "Slots", value: String(slots.length) },
            { label: "Attendance", value: String(attendance.length) },
          ]}
        />
      </Card>
    </ScreenShell>
  );
}

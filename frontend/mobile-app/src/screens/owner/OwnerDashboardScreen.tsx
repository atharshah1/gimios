import React from "react";
import { Card } from "../../components/Card";
import { MetricGrid } from "../../components/MetricGrid";
import { ScreenShell } from "../../components/ScreenShell";
import { StateView } from "../../components/StateView";
import { useAttendance } from "../../hooks/useAttendance";
import { useRoster } from "../../hooks/useRoster";
import { useSlots } from "../../hooks/useSlots";

export function OwnerDashboardScreen() {
  const { trainers, members, loading: rosterLoading, error: rosterError } = useRoster();
  const { slots, loading: slotsLoading, error: slotsError } = useSlots();
  const { attendance, loading: attendanceLoading, error: attendanceError } = useAttendance();

  return (
    <ScreenShell title="Owner Dashboard">
      <Card title="Operations Snapshot" subtitle="Live linked flow metrics">
        {(rosterLoading || slotsLoading || attendanceLoading) ? <StateView title="Loading" description="Syncing dashboard metrics..." /> : null}
        {(rosterError || slotsError || attendanceError) ? <StateView title="Error" description={rosterError || slotsError || attendanceError || "Unknown error"} /> : null}
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

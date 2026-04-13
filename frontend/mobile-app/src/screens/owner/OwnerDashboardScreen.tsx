import React from "react";
import { Card } from "../../components/Card";
import { MetricGrid } from "../../components/MetricGrid";
import { ScreenShell } from "../../components/ScreenShell";
import { StateView } from "../../components/StateView";
import { SkeletonGroup } from "../../components/SkeletonGroup";
import { useAttendance } from "../../hooks/useAttendance";
import { useRoster } from "../../hooks/useRoster";
import { useSlots } from "../../hooks/useSlots";

export function OwnerDashboardScreen() {
  const { trainers, members, loading: rosterLoading, error: rosterError, refresh: refreshRoster } = useRoster();
  const { slots, loading: slotsLoading, error: slotsError, refresh: refreshSlots } = useSlots();
  const { attendance, loading: attendanceLoading, error: attendanceError, refresh: refreshAttendance } = useAttendance();

  return (
    <ScreenShell title="Owner Dashboard" onRefresh={async () => { await Promise.all([refreshRoster(), refreshSlots(), refreshAttendance()]); }}>
      <Card title="Operations Snapshot" subtitle="Live linked flow metrics">
        {(rosterLoading || slotsLoading || attendanceLoading) ? <SkeletonGroup rows={4} /> : null}
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

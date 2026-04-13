import React from "react";
import { Text } from "react-native";
import { Card } from "../../components/Card";
import { StateView } from "../../components/StateView";
import { SkeletonGroup } from "../../components/SkeletonGroup";
import { ScreenShell } from "../../components/ScreenShell";
import { useAttendance } from "../../hooks/useAttendance";
import { useAuth } from "../../hooks/useAuth";

export function AttendanceHistoryScreen() {
  const { attendance, loading, error } = useAttendance();
  const { currentUser } = useAuth();
  const memberHistory = attendance.filter((record) => record.memberId === currentUser?.id);

  return (
    <ScreenShell title="Attendance History">
      {loading ? <SkeletonGroup rows={3} /> : null}
      {error ? <StateView title="Error" description={error} /> : null}
      {!loading && !error && memberHistory.length === 0 ? (
        <StateView title="No attendance yet" description="Attend a booked slot and history appears here." />
      ) : null}
      {!loading && !error && memberHistory.length > 0 ? (
        <Card title="Profile → Attendance" subtitle="Date · Slot · Status">
          {memberHistory.map((record) => (
            <Text key={record.id}>{`${record.date} · ${record.slot} · ${record.status}`}</Text>
          ))}
        </Card>
      ) : null}
    </ScreenShell>
  );
}

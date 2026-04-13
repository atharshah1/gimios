import React from "react";
import { Text } from "react-native";
import { Card } from "../../components/Card";
import { StateView } from "../../components/StateView";
import { ScreenShell } from "../../components/ScreenShell";
import { useAttendance } from "../../hooks/useAttendance";
import { useAuth } from "../../hooks/useAuth";

export function AttendanceHistoryScreen() {
  const { attendance, loading, error } = useAttendance();
  const { currentUser } = useAuth();
  const memberHistory = attendance.filter((record) => record.memberId === currentUser?.id);

  return (
    <ScreenShell title="Attendance History">
      {loading ? <StateView title="Loading" description="Loading attendance history..." /> : null}
      {error ? <StateView title="Error" description={error} /> : null}
      {!loading && memberHistory.length === 0 ? (
        <StateView title="No attendance yet" description="Attend a booked slot and history appears here." />
      ) : (
        <Card title="Profile → Attendance" subtitle="Date · Slot · Status">
          {memberHistory.map((record) => (
            <Text key={record.id}>{`${record.date} · ${record.slot} · ${record.status}`}</Text>
          ))}
        </Card>
      )}
    </ScreenShell>
  );
}
